const { Rate } = require("../models");

// 특정 유저의 Rate 조회
exports.getRateByUserId = async (req, res) => {
  try {
    const rate = await Rate.findOne({ where: { userId: req.params.userId } });
    if (!rate)
      return res
        .status(404)
        .json({ message: "유저의 레이팅 정보를 찾을 수 없습니다." });
    res.json(rate);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
};

// Rate 생성 (초기 값 등록)
exports.createRate = async (req, res) => {
  try {
    const { userId, rateValue } = req.body;
    const existing = await Rate.findOne({ where: { userId } });
    if (existing)
      return res
        .status(400)
        .json({ message: "이미 레이팅 정보가 존재합니다." });

    const newRate = await Rate.create({ userId, rateValue });
    res.status(201).json(newRate);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
};

// Rate 업데이트 (점수 변동)
exports.updateRate = async (req, res) => {
  try {
    const { rateValue } = req.body;
    const rate = await Rate.findOne({ where: { userId: req.params.userId } });

    if (!rate)
      return res.status(404).json({ message: "레이팅 정보가 없습니다." });

    await rate.update({ rateValue });
    res.json(rate);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
};

// 전체 Rate 목록 (관리자용)
exports.getAllRates = async (req, res) => {
  try {
    const rates = await Rate.findAll({ order: [["rateValue", "DESC"]] });
    res.json(rates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "서버 오류" });
  }
};
