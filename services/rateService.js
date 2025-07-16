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

// Rate 최신화하기
exports.updateUserRate = async (userId, opponentRate, result) => {
  const rate = await Rate.findOne({ where: { userId } });
  if (!rate) throw new Error("Rate 정보가 없습니다.");

  const newRateValue = calculateNewRate(rate.rateValue, opponentRate, result);

  await rate.update({ rateValue: newRateValue });

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
