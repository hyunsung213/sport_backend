const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Interest = sequelize.define(
    "Interest",
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
    },
    {
      tableName: "Interest",
      timestamps: false,
    }
  );

  return Interest;
};
