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

module.exports = router;
