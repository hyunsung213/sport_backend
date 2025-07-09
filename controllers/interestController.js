const { Interest, Game, Place, Option, Photo, User } = require("../models");

exports.addInterest = async (req, res) => {
  try {
    const userId = req.session?.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "로그인 필요합니다" });
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
    const userId = req.session?.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "로그인 필요합니다" });
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
    // 세션에 로그인 정보가 있는 경우 우선 사용
    const userId = req.session?.user?.id;

    // URL 파라미터로 userId가 전달되면 사용, 없으면 세션 값 사용

    if (!userId) {
      return res.status(401).json({ message: "로그인 필요 또는 userId 누락" });
    }

    const interests = await Interest.findAll({
      where: { userId },
      include: [
        {
          model: Game,
          include: [
            { model: Place, include: [Option, Photo, User] },
            { model: User },
          ],
        },
      ],
    });

    res.json(interests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
