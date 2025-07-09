const { Team } = require("../models");

// 팀 생성
exports.createTeam = async (req, res) => {
  try {
    const { playerA, playerB } = req.body;

    if (playerA === playerB) {
      return res
        .status(400)
        .json({ message: "서로 다른 유저로 팀을 구성하세요." });
    }

    const newTeam = await Team.create({ playerA, playerB });
    res.status(201).json(newTeam);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "팀 생성 실패" });
  }
};

// 특정 팀 조회
exports.getTeamById = async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.teamId);
    if (!team)
      return res.status(404).json({ message: "팀을 찾을 수 없습니다." });
    res.json(team);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "팀 조회 실패" });
  }
};

// 전체 팀 조회 (옵션)
exports.getAllTeams = async (req, res) => {
  try {
    const teams = await Team.findAll();
    res.json(teams);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "팀 목록 조회 실패" });
  }
};
