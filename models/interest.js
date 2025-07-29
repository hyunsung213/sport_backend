const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Interest = sequelize.define(
    "Interest",
    {
      gameId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "Game",
          key: "gameId",
        },
        onDelete: "CASCADE", // 관계형 무결성 보장
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "User",
          key: "userId",
        },
        onDelete: "CASCADE",
      },
    },
    {
      tableName: "Interest",
      timestamps: false,
    }
  );

  return Interest;
};
