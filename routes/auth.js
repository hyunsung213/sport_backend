const express = require("express");
const router = express.Router();
const { User } = require("../models");
const bcrypt = require("bcrypt");
const axios = require("axios");

// 카카오 인증정보
const KAKAO_REST_APP_KEY = process.env.KAKAO_APP_KEY;
const KAKAO_REDIRECT_URI = process.env.KAKAO_REDIRECT_URI;

// 구글 인증정보
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

// 로그인
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user || user.isSocial) {
    return res
      .status(401)
      .json({ message: "사용자 없음 또는 소셜 로그인 전용 계정" });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: "비밀번호 오류" });

  req.session.user = {
    id: user.userId,
    email: user.email,
    userName: user.userName,
    isManager: user.isManager,
    isSupporter: user.isSupporter,
    isSuperManager: user.isSuperManager,
    isSocial: user.isSocial,
  };
  res.json({ message: "로그인 성공" });
});

// 로그아웃
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "로그아웃 완료" });
  });
});

// 회원가입
router.post("/signup", async (req, res) => {
  const {
    userName,
    password,
    email,
    city,
    phoneNum,
    isManager,
    isSupporter = false,
    isSuperManager = false,
  } = req.body;

  if (!userName || !password || !email || !city || !phoneNum) {
    return res.status(400).json({ message: "필수 값을 모두 입력하세요." });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "이미 등록된 이메일입니다." });
    }

    const newUser = await User.create({
      userName,
      password, // 모델에서 bcrypt 처리됨
      email,
      city,
      phoneNum,
      isManager,
      isSuperManager,
      isSupporter,
      isSocial: false,
    });

    res.json({ message: "회원가입 성공", userId: newUser.userId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "회원가입 중 오류 발생" });
  }
});

// 로그인 상태 확인
router.get("/me", (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ message: "로그인 필요" });
  }
});

// 카카오 로그인
router.get("/kakao", async (req, res) => {
  const code = req.query.code;
  try {
    const tokenRes = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        client_id: KAKAO_REST_APP_KEY,
        redirect_uri: KAKAO_REDIRECT_URI,
        code,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const access_token = tokenRes.data.access_token;

    const userRes = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const kakaoUser = userRes.data;
    const kakaoId = kakaoUser.id.toString();
    const userName = kakaoUser.kakao_account.profile.nickname;
    const email = kakaoUser.kakao_account.email || null;
    let isNewUser = false;
    let user = await User.findOne({ where: { kakaoId } });

    if (!user) {
      user = await User.create({
        kakaoId,
        userName,
        email,
        isSocial: true,
        isManager: false,
        isSupporter: false,
        isSuperManager: false,
      });
      isNewUser = true;
    }

    req.session.user = {
      id: user.userId,
      userName: user.userName,
      email: user.email,
      isManager: user.isManager,
      isSupporter: user.isSupporter,
      isSuperManager: user.isSuperManager,
      isSocial: user.isSocial,
    };
    // ✅ 성공 시 JSON 반환
    res.json({
      message: "카카오 로그인 성공",
      user: req.session.user,
      isNewUser,
    });
  } catch (err) {
    console.error("카카오 로그인 실패:", err.response?.data || err.message);
    res.status(500).send("카카오 로그인 중 오류 발생");
  }
});

// 구글 로그인
router.get("/google", async (req, res) => {
  const code = req.query.code;

  try {
    // [1] 액세스 토큰 요청
    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      new URLSearchParams({
        code: code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI, // 예: http://localhost:3000/auth/google
        grant_type: "authorization_code",
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const access_token = tokenRes.data.access_token;

    // [2] 사용자 정보 요청
    const userRes = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    const googleUser = userRes.data;
    const googleId = googleUser.sub; // 고유 식별자
    const userName = googleUser.name;
    const email = googleUser.email || null;
    let isNewUser = false;
    // [3] DB에 유저 검색 또는 생성
    let user = await User.findOne({ where: { googleId } });

    if (!user) {
      user = await User.create({
        googleId,
        userName,
        email,
        isSocial: true,
        isManager: false,
        isSupporter: false,
        isSuperManager: false,
      });
      isNewUser = true;
    }

    // [4] 세션에 저장
    req.session.user = {
      id: user.userId,
      userName: user.userName,
      email: user.email,
      isManager: user.isManager,
      isSupporter: user.isSupporter,
      isSuperManager: user.isSuperManager,
      isSocial: user.isSocial,
    };
    // ✅ 성공 시 JSON 반환
    res.json({
      message: "구글 로그인 성공",
      user: req.session.user,
      isNewUser,
    });
  } catch (err) {
    console.error("구글 로그인 실패:", err.response?.data || err.message);
    res.status(500).send("구글 로그인 중 오류 발생");
  }
});

module.exports = router;
