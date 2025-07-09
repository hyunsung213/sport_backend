// routes/session.js
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  if (req.session && req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ message: "로그인 필요" });
  }
});

module.exports = router;
