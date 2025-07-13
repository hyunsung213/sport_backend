const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Match = sequelize.define(
    "Match",
    {
      matchId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      gameId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Game", // 실제 DB 테이블명 또는 모델명
          key: "gameId",
        },
        onDelete: "CASCADE",
      },
      isDouble: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      teamA: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Team",
          key: "teamId",
        },
      },
      teamB: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Team",
          key: "teamId",
        },
      },
      winnerTeam: {
        type: DataTypes.ENUM("ATeam", "BTeam"),
        allowNull: false,
      },
      teamAScore: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      teamBScore: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      playerOfMatch: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "User",
          key: "userId",
        },
      },
    },
    {
      tableName: "Match",
      timestamps: true, // createdAt, updatedAt 자동 추가
    }
  );

  return Match;
};
