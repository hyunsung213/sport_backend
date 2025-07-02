const { Game, Place, Option, User, Photo } = require("../models");
const { Op } = require("sequelize");

exports.createGame = async (req, res) => {
  try {
    const game = await Game.create(req.body);
    res.json(game);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllGames = async (req, res) => {
  try {
    const games = await Game.findAll({
      include: [
        { model: Place, include: [Option, Photo, User] },
        { model: User },
      ],
    });
    res.json(games);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getGamesWithDateFilter = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const whereClause = {};

    // 날짜 필터 적용 (시작일자 ~ 종료일자)
    if (startDate) {
      whereClause.date = { [Op.gte]: new Date(startDate) }; // 시작일자 (이후)
    }

    if (endDate) {
      whereClause.date = whereClause.date
        ? { ...whereClause.date, [Op.lte]: new Date(endDate) } // 종료일자 (이전)
        : { [Op.lte]: new Date(endDate) };
    }

    const games = await Game.findAll({
      where: whereClause,
      include: [
        {
          model: Place,
          include: [Option, Photo, User],
        },
        {
          model: User,
        },
      ],
      order: [["date", "ASC"]],
    });

    res.json(games);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "게임 데이터 조회 실패" });
  }
};

exports.getGameById = async (req, res) => {
  try {
    const game = await Game.findByPk(req.params.id, {
      include: [
        { model: Place, include: [Option, Photo, User] },
        { model: User },
      ],
    });
    if (game) res.json(game);
    else res.status(404).json({ error: "Game not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateGame = async (req, res) => {
  try {
    const [updated] = await Game.update(req.body, {
      where: { gameId: req.params.id },
    });
    if (updated) res.json({ message: "Game updated" });
    else res.status(404).json({ error: "Game not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteGame = async (req, res) => {
  try {
    const deleted = await Game.destroy({
      where: { gameId: req.params.id },
    });
    if (deleted) res.json({ message: "Game deleted" });
    else res.status(404).json({ error: "Game not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
