const { Participation, User, Game } = require("../models");

// 게임 참가
exports.createParticipation = async (req, res) => {
  try {
    const { userId, gameId, isConfirmed } = req.body;
    const participation = await Participation.create({
      userId,
      gameId,
      isConfirmed: isConfirmed || false,
    });
    res.json(participation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 게임 참가 취소
exports.deleteParticipation = async (req, res) => {
  try {
    const { userId, gameId } = req.body;
    const deleted = await Participation.destroy({
      where: { userId, gameId },
    });
    if (deleted) res.json({ message: "참가 취소 완료" });
    else res.status(404).json({ error: "참가 내역 없음" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 특정 게임 참가자 목록 조회
exports.getParticipantsByGame = async (req, res) => {
  try {
    const participants = await Participation.findAll({
      where: { gameId: req.params.gameId },
      include: [User],
    });
    res.json(participants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 특정 유저가 참가한 게임 목록 조회
exports.getGamesByUser = async (req, res) => {
  try {
    const games = await Participation.findAll({
      where: { userId: req.params.userId },
      include: [Game],
    });
    res.json(games);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
