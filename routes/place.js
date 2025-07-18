const express = require("express");
const router = express.Router();
const placeController = require("../controllers/placeController");
const { authenticateToken } = require("../middleware/auth");

router.post("/", authenticateToken, placeController.createPlace); // 장소 생성
router.get("/", placeController.getAllPlaces); // 전체 장소 조회
router.get("/my", authenticateToken, placeController.getMyPlace); // 내 장소 조회
router.get("/:id", placeController.getPlaceById); // 특정 장소 조회
router.put("/:id", placeController.updatePlace); // 장소 수정
router.delete("/:id", placeController.deletePlace); // 장소 삭제

module.exports = router;
