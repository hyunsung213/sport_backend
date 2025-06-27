const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Game = sequelize.define(
    "Game",
    {
      gameId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      placeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Place",
          key: "placeId",
        },
      },
      date: DataTypes.DATE,
      numOfMember: DataTypes.INTEGER,
    },
    {
      tableName: "Game",
      timestamps: true,
    }
  );

  return Game;
};
