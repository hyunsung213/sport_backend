const express = require("express");
const router = express.Router();
const rateController = require("../controllers/rateController");

// 전체 레이팅 조회 (관리자용)
router.get("/", rateController.getAllRates);

// 특정 유저 레이팅 조회
router.get("/:userId", rateController.getRateByUserId);

// 레이팅 생성 (초기 등록)
router.post("/", rateController.createRate);

// 레이팅 업데이트 (점수 변동)
router.put("/:userId", rateController.updateRate);

module.exports = router;
