const express = require("express");
const router = express.Router();
const { User } = require("../models");
const bcrypt = require("bcrypt");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user) return res.status(401).json({ message: "사용자 없음" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: "비밀번호 오류" });

  req.session.user = {
    id: user.userId,
    email: user.email,
    isManager: user.isManager,
    isSuperManager: user.isSuperManager,
  };
  res.json({ message: "로그인 성공" });
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ message: "로그아웃 완료" });
  });
});

router.post("/signup", async (req, res) => {
  const {
    userName,
    password,
    email,
    city,
    phoneNum,
    isManager,
    isSuperManager,
  } = req.body;

  if (
    !userName ||
    !password ||
    !email ||
    !city ||
    !phoneNum ||
    isManager === undefined ||
    isSuperManager === undefined
  ) {
    return res.status(400).json({ message: "필수 값을 모두 입력하세요." });
  }

  try {
    const newUser = await User.create({
      userName,
      password,
      email,
      city,
      phoneNum,
      isManager: false,
      grade: 0,
    });

    res.json({ message: "회원가입 성공", userId: newUser.userId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "회원가입 중 오류 발생" });
  }
});

router.get("/me", (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ message: "로그인 필요" });
  }
});




// KAKAO 로그인
router.get("/auth/kakao", async (req, res) => {
  const code = req.query.code;

  try {
    // 1. 카카오 토큰 요청
    const tokenRes = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        client_id: REST_API_KEY,
        redirect_uri: REDIRECT_URI,
        code,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const access_token = tokenRes.data.access_token;

    // 2. 사용자 정보 요청
    const userRes = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const kakaoUser = userRes.data;
    const kakaoId = kakaoUser.id.toString();
    const nickname = kakaoUser.kakao_account.profile.nickname;
    const email = kakaoUser.kakao_account.email;

    // 3. 사용자 DB 조회 또는 생성
    let user = await User.findOne({ where: { kakaoId } });

    if (!user) {
      user = await User.create({
        kakaoId,
        nickname,
        email,
      });
    }

    // 4. 로그인 처리 (세션에 저장)
    req.session.user = {
      id: user.userId,
      nickname: user.nickname,
    };

    res.redirect("/"); // 로그인 성공 후 메인 페이지 등으로 리디렉션
  } catch (err) {
    console.error("카카오 로그인 실패:", err);
    res.status(500).send("카카오 로그인 중 오류 발생");
  }
});


module.exports = router;
