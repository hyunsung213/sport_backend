const { Participation, User, Game } = require("../models");
const { updateGameProceedStatus } = require("../services/gameService");

exports.createParticipation = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "로그인 필요 또는 userId 누락" });
    }
    const { gameId } = req.body;

    const game = await Game.findByPk(gameId);
    if (!game) return res.status(404).json({ message: "게임 없음" });

    // ✅ 확정된 인원 수 조회
    const confirmedCount = await Participation.count({
      where: {
        gameId,
        isConfirmed: true,
      },
    });

    // ✅ 정원이 다 찼다면 참가 신청 불가
    if (confirmedCount >= game.numOfMember) {
      return res
        .status(400)
        .json({ message: "정원이 모두 찼습니다. 참가 신청이 불가능합니다." });
    }

    // ✅ 중복 신청 불가
    const existing = await Participation.findOne({ where: { userId, gameId } });
    if (existing) return res.status(400).json({ message: "이미 신청됨" });

    const participation = await Participation.create({
      userId,
      gameId,
      isConfirmed: false, // 결제 전이므로 false
    });

    // 결제창으로 이동 (프론트에서)
    res.status(201).json(participation);
  } catch (err) {
    console.error("참가 신청 오류:", err);
    res.status(500).json({ error: err.message });
  }
};

//  결제 후 참가확정
exports.confirmParticipationPayment = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "로그인 필요 또는 userId 누락" });
    }
    const { gameId } = req.body;

    const participation = await Participation.findOne({
      where: { userId, gameId, isConfirmed: false },
    });

    if (!participation) {
      return res
        .status(404)
        .json({ message: "참가 내역이 없거나 이미 확정됨" });
    }

    participation.isConfirmed = true;
    await participation.save();

    // 진행 여부 갱신
    await updateGameProceedStatus(gameId);

    res.json({ message: "결제 완료 및 참가 확정" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 게임 참가 취소
exports.deleteParticipation = async (req, res) => {
  try {
    const { gameId } = req.body;

    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "로그인 필요 또는 userId 누락" });
    }

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
exports.getParticipationsByUser = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "로그인 필요 또는 userId 누락" });
    }

    const games = await Participation.findAll({
      where: { userId: userId },
      include: [Game],
    });
    res.json(games);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
