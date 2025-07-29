const express = require("express");
const router = express.Router();
const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { authenticateToken } = require("../middleware/auth");

const KAKAO_REST_APP_KEY = process.env.KAKAO_APP_KEY;
const KAKAO_REDIRECT_URI = process.env.KAKAO_REDIRECT_URI;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// 토큰 생성 함수
const createToken = (user) =>
  jwt.sign(
    {
      userId: user.userId,
      email: user.email,
      userName: user.userName,
      isManager: user.isManager,
      isSupporter: user.isSupporter,
      isSuperManager: user.isSuperManager,
      isSocial: user.isSocial,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

// 로그인
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  console.log("email: ", email);
  console.log("password: ", password);

  if (!user || user.isSocial) {
    return res
      .status(401)
      .json({ message: "사용자 없음 또는 소셜 로그인 전용 계정" });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    console.log("비밀번호 오류");
    return res.status(401).json({ message: "비밀번호 오류" });
  }

  const token = createToken(user);
  res.json({ message: "로그인 성공", token });
});

// 로그아웃 (프론트에서 토큰 삭제하면 끝)
router.post("/logout", (req, res) => {
  res.json({ message: "클라이언트에서 토큰 삭제하세요" });
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

    // 🔐 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10); // saltRounds = 10

    const newUser = await User.create({
      userName,
      password: hashedPassword, // 해싱된 비밀번호 저장
      email,
      city,
      phoneNum,
      isManager,
      isSuperManager,
      isSupporter,
      isSocial: false,
    });

    const token = createToken(newUser);
    res.json({ message: "회원가입 성공", userId: newUser.userId, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "회원가입 중 오류 발생" });
  }
});

// 로그인 상태 확인
router.get("/me", authenticateToken, (req, res) => {
  res.json(req.user);
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

    const token = createToken(user);
    res.json({
      message: "카카오 로그인 성공",
      token,
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
    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const access_token = tokenRes.data.access_token;

    const userRes = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    const googleUser = userRes.data;
    const googleId = googleUser.sub;
    const userName = googleUser.name;
    const email = googleUser.email || null;
    let isNewUser = false;

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

    const token = createToken(user);
    res.json({
      message: "구글 로그인 성공",
      token,
      isNewUser,
    });
  } catch (err) {
    console.error("구글 로그인 실패:", err.response?.data || err.message);
    res.status(500).send("구글 로그인 중 오류 발생");
  }
});

module.exports = router;
