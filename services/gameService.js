const { Game, Participation, Team, Match } = require("../models");

exports.updateGameProceedStatus = async (gameId) => {
  try {
    const game = await Game.findByPk(gameId);

    if (!game) throw new Error("Game not found");

    const participants = await Participation.findAll({
      where: {
        gameId,
        isConfirmed: true,
      },
    });

    const confirmedUserIds = participants.map((p) => p.userId);

    if (confirmedUserIds.length !== 5) {
      console.log("확정된 인원이 5명이 아닙니다. 자동 매칭 생략.");
      return;
    }

    if (!game.isProceed) {
      game.isProceed = true;
      await game.save();
      console.log(`Game ${gameId} is now marked as 'Proceeding'`);

      // ✅ 고정된 최적 팀 구성 순서
      const [A, B, C, D, E] = confirmedUserIds;

      const teamCombinations = [
        [A, B],
        [C, D], // Match 1
        [A, C],
        [D, E], // Match 2
        [A, D],
        [B, E], // Match 3
        [A, E],
        [B, C], // Match 4
        [B, D],
        [C, E], // Match 5
      ];

      const createdTeams = [];

      for (const [playerA, playerB] of teamCombinations) {
        const team = await Team.create({ playerA, playerB });
        createdTeams.push(team.teamId);
      }

      // ✅ Match 생성
      for (let i = 0; i < 5; i++) {
        await Match.create({
          gameId,
          isDouble: true,
          teamA: createdTeams[i * 2],
          teamB: createdTeams[i * 2 + 1],
          teamAScore: 0,
          teamBScore: 0,
          winnerTeam: "TeamA", // 임시 기본값
          playerOfMatch: null,
        });
      }

      console.log(`✅ 자동 팀 및 매치 생성 완료 (5경기)`);
    }
  } catch (err) {
    console.error("게임 진행 상태 업데이트 실패:", err);
  }
};
