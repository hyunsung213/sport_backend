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
          model: "Game",
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
        onDelete: "CASCADE",
      },
      teamB: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Team",
          key: "teamId",
        },
        onDelete: "CASCADE",
      },
      winnerTeam: {
        type: DataTypes.ENUM("TeamA", "TeamB"),
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
        onDelete: "SET NULL",
      },
    },
    {
      tableName: "Match",
      timestamps: true,
    }
  );

  return Match;
};
