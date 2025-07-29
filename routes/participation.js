const express = require("express");
const router = express.Router();
const participationController = require("../controllers/participationController");
const { authenticateToken } = require("../middleware/auth");

router.post(
  "/",
  authenticateToken,
  participationController.createParticipation
); // 참가

router.delete(
  "/",
  authenticateToken,
  participationController.deleteParticipation
); // 참가 취소

router.put(
  "/confirm",
  authenticateToken,
  participationController.confirmParticipationPayment
); // 참가신청 확인

router.get(
  "/my",
  authenticateToken,
  participationController.getParticipationsByUser
); // 유저별 조회

router.get("/game/:gameId", participationController.getParticipantsByGame); // 게임별 조회

module.exports = router;
