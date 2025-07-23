const express = require("express");
const router = express.Router();
const gameController = require("../controllers/gameController");
const { authenticateToken } = require("../middleware/auth");

router.post("/", gameController.createGame); // 게임 생성
router.get("/", gameController.getAllGames); // 전체 게임 조회
router.get("/date", gameController.getGamesWithDateFilter); // 날짜 별로 게임 조회
router.get("/supporter", authenticateToken, gameController.getGamesForSupport); // 서포터 담당 게임 조회
router.get("/:id", gameController.getGameById); // 특정 게임 조회
router.put("/end/:id", gameController.updateGameIsEnd); // 게임 끝내기
router.put("/:id", gameController.updateGame); // 게임 수정
router.delete("/:id", gameController.deleteGame); // 게임 삭제

module.exports = router;
