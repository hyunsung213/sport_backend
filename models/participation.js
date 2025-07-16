const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Participation = sequelize.define(
    "Participation",
    {
      gameId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: "Game",
          key: "gameId",
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: "User",
          key: "userId",
        },
      },
      isConfirmed: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      tableName: "Participation",
      timestamps: true,
    }
  );

  return Participation;
};
