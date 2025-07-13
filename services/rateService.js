const { Rate, User } = require("../models");
const { Op } = require("sequelize");

// 점수 변동 공식 (Elo 시스템 변형)
// k는 변동폭으로 상위 랭커는 낮고, 하위 랭커는 높게 설정
const calculateNewRate = (currentRate, opponentRate, result, k = 20) => {
  const expectedScore =
    1 / (1 + Math.pow(10, (opponentRate - currentRate) / 400));
  const newRate = currentRate + k * (result - expectedScore);

  return Math.round(newRate);
};

/**
 * 유저 점수 업데이트 메인 로직
 * @param {number} userId - 대상 유저 ID
 * @param {number} opponentRate - 상대방 현재 점수
 * @param {number} result - 경기 결과 (승 1, 패 0, 무 0.5)
 */
const updateUserRate = async (userId, opponentRate, result) => {
  const rateRecord = await Rate.findOne({ where: { userId } });
  if (!rateRecord) throw new Error("Rate 정보가 없습니다.");

  const newRateValue = calculateNewRate(
    rateRecord.rateValue,
    opponentRate,
    result
  );

  await rateRecord.update({ rateValue: newRateValue });

  return newRateValue;
};

const calculateDoublesRate = (teamARates, teamBRates, winningTeam) => {
  const avgA = (teamARates[0] + teamARates[1]) / 2;
  const avgB = (teamBRates[0] + teamBRates[1]) / 2;

  const expectedA = 1 / (1 + Math.pow(10, (avgB - avgA) / 400));
  const k = 20;

  const deltaA = k * ((winningTeam === "A" ? 1 : 0) - expectedA);
  const deltaB = k * ((winningTeam === "B" ? 1 : 0) - (1 - expectedA));

  return {
    deltaA: Math.round(deltaA),
    deltaB: Math.round(deltaB),
  };
};

module.exports = {
  calculateNewRate,
  updateUserRate,
};
