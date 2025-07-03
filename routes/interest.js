const express = require("express");
const router = express.Router();
const interestController = require("../controllers/interestController");

// 관심등록 추가
router.post("/", interestController.addInterest);

// 관심등록 해제
router.delete("/:gameId", interestController.deleteInterest);

// 특정 유저의 관심 게임 목록 조회
router.get("/my", interestController.getUserInterests);

module.exports = router;
