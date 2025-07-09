const { Match } = require("../models");

// 경기 생성
exports.createMatch = async (req, res) => {
  try {
    const {
      gameId,
      isDouble,
      teamA,
      teamB,
      winnerTeam,
      teamAScore,
      teamBScore,
      playerOfMatch,
    } = req.body;

    if (teamA === teamB) {
      return res
        .status(400)
        .json({ message: "서로 다른 팀으로 경기를 구성하세요." });
    }

    const newMatch = await Match.create({
      gameId,
      isDouble,
      teamA,
      teamB,
      winnerTeam,
      teamAScore,
      teamBScore,
      playerOfMatch,
    });

    res.status(201).json(newMatch);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "경기 생성 실패" });
  }
};

// 특정 경기 조회
exports.getMatchById = async (req, res) => {
  try {
    const match = await Match.findByPk(req.params.matchId);
    if (!match)
      return res.status(404).json({ message: "경기를 찾을 수 없습니다." });
    res.json(match);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "경기 조회 실패" });
  }
};

// 전체 경기 목록 조회 (옵션)
exports.getAllMatches = async (req, res) => {
  try {
    const matches = await Match.findAll();
    res.json(matches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "경기 목록 조회 실패" });
  }
};
