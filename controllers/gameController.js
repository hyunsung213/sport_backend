const {
  Game,
  Place,
  Option,
  User,
  Photo,
  Note,
  Rate,
  Participation,
  Team,
  Match,
} = require("../models");
const { Op, where } = require("sequelize");
const game = require("../models/game");
const { updateUserRate } = require("../services/rateService");

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
        { model: User, include: [Rate] },
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
          include: [Rate],
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

// Id로 게임 조회하기
exports.getGameById = async (req, res) => {
  try {
    const game = await Game.findByPk(req.params.id, {
      include: [
        { model: Place, include: [Option, Photo, Note, User] },
        {
          model: User,
          through: { model: Participation, attributes: ["isConfirmed"] },
          include: { model: Rate },
        },
      ],
    });
    if (game) res.json(game);
    else res.status(404).json({ error: "Game not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 서포터에게 게임 정보 제공하기
exports.getGamesForSupport = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "로그인 필요 또는 userId 누락" });
    }
    if (!req.user?.isSupporter) {
      return res.status(403).json({ message: "당신은 서포터가 아닙니다." });
    }

    const games = await Game.findAll({
      where: { supporterId: userId },
      include: [
        {
          model: Place,
          include: [Option, Note, User],
        },
        {
          model: Match,
          include: [
            {
              model: Team,
              as: "TeamA",
              include: [
                { model: User, as: "PlayerA", include: [Rate] },
                { model: User, as: "PlayerB", include: [Rate] },
              ],
            },
            {
              model: Team,
              as: "TeamB",
              include: [
                { model: User, as: "PlayerA", include: [Rate] },
                { model: User, as: "PlayerB", include: [Rate] },
              ],
            },
          ],
        },
        {
          model: User,
          as: "Supporter",
        },
      ],
    });

    if (games) {
      res.json(games);
    } else res.status(404).json({ error: "Game not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 게임 정보 업데이트 하기
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

// 게임 종료 하기
exports.updateGameIsEnd = async (req, res) => {
  try {
    const gameId = req.params.id;

    // 1. 게임 종료 처리
    const [updated] = await Game.update(req.body, {
      where: { gameId },
    });

    if (!updated) return res.status(404).json({ error: "Game not found" });
    console.log("게임종료 완료!");

    // 2. 해당 게임의 모든 Match 불러오기
    const matches = await Match.findAll({
      where: { gameId },
      include: [
        {
          model: Team,
          as: "TeamA",
          include: [
            { model: User, as: "PlayerA", include: [Rate] },
            { model: User, as: "PlayerB", include: [Rate] },
          ],
        },
        {
          model: Team,
          as: "TeamB",
          include: [
            { model: User, as: "PlayerA", include: [Rate] },
            { model: User, as: "PlayerB", include: [Rate] },
          ],
        },
      ],
    });

    // 3. Match별로 선수 Rate 계산
    for (const match of matches) {
      const { TeamA, TeamB, winnerTeam } = match;

      const teamARates = [
        TeamA.PlayerA.Rate.rateValue,
        TeamA.PlayerB.Rate.rateValue,
      ];
      const teamBRates = [
        TeamB.PlayerA.Rate.rateValue,
        TeamB.PlayerB.Rate.rateValue,
      ];

      const avgA = (teamARates[0] + teamARates[1]) / 2;
      const avgB = (teamBRates[0] + teamBRates[1]) / 2;

      const resultA = winnerTeam === "TeamA" ? 1 : 0;
      const resultB = winnerTeam === "TeamB" ? 1 : 0;

      // 4. TeamA 각각의 선수 업데이트 (상대 평균 = avgB)
      await updateUserRate(TeamA.PlayerA.userId, avgB, resultA);
      await updateUserRate(TeamA.PlayerB.userId, avgB, resultA);

      // 5. TeamB 각각의 선수 업데이트 (상대 평균 = avgA)
      await updateUserRate(TeamB.PlayerA.userId, avgA, resultB);
      await updateUserRate(TeamB.PlayerB.userId, avgA, resultB);
    }

    res.json({ message: "게임을 종료하고, 개인 Rate를 최신화했습니다. " });
  } catch (err) {
    console.error("❌ 게임 종료 처리 중 오류:", err);
    res.status(500).json({ error: err.message });
  }
};

// 게임 삭제하기
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
