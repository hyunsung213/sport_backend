const { Game, Place, Option, User } = require("../models");
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
    const games = await Game.findAll();
    res.json(games);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getGamesWithDateFilter = async (req, res) => {
  try {
    const { afterDate, beforeDate } = req.query;

    const whereClause = {};

    if (afterDate) {
      whereClause.date = { [Op.gte]: new Date(afterDate) };
    }

    if (beforeDate) {
      whereClause.date = whereClause.date
        ? { ...whereClause.date, [Op.lte]: new Date(beforeDate) }
        : { [Op.lte]: new Date(beforeDate) };
    }

    const games = await Game.findAll({
      where: whereClause,
      include: [{ model: Place }, { model: User }],
      order: [["date", "ASC"]],
    });

    res.json(games);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getGameById = async (req, res) => {
  try {
    const game = await Game.findByPk(req.params.id, {
      include: [{ model: Place, include: [Option] }, { model: User }],
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
