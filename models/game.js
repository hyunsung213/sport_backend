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
      supporterId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "User",
          key: "userId",
        },
      },
      date: DataTypes.DATE,
      numOfMember: DataTypes.INTEGER,
      cost: DataTypes.INTEGER,
      isProceed: DataTypes.BOOLEAN,
      isFinished: DataTypes.BOOLEAN,
    },
    {
      tableName: "Game",
      timestamps: true,
    }
  );

  return Game;
};
