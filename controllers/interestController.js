const { Interest, Game, Place, Option, Photo, User } = require("../models");

exports.addInterest = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "로그인 필요 또는 userId 누락" });
    }

    const { gameId } = req.body;

    await Interest.create({ userId, gameId });
    res.json({ message: "관심등록 완료" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteInterest = async (req, res) => {
  try {
    console.log("🛰 요청 IP:", req.ip);
    console.log("🛰 Origin:", req.headers.origin);
    console.log("🛰 Host:", req.headers.host);
    console.log("🛰 User-Agent:", req.headers["user-agent"]);

    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "로그인 필요 또는 userId 누락" });
    }

    const gameId = req.params.gameId;

    const deleted = await Interest.destroy({
      where: { gameId, userId },
    });

    if (deleted) res.json({ message: "관심등록 해제 완료" });
    else res.status(404).json({ error: "관심등록 내역 없음" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserInterests = async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "로그인 필요 또는 userId 누락" });
    }

    const interests = await Interest.findAll({
      where: { userId },
      include: [
        {
          model: Game,
        },
      ],
    });
    res.json(interests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
