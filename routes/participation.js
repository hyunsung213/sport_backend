const express = require("express");
const router = express.Router();
const participationController = require("../controllers/participationController");

router.post("/", participationController.createParticipation); // 참가
router.delete("/", participationController.deleteParticipation); // 참가 취소
router.get("/game/:gameId", participationController.getParticipantsByGame); // 게임별 조회
router.get("/user/:userId", participationController.getGamesByUser); // 유저별 조회

module.exports = router;
