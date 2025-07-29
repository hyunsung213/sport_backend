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
        onDelete: "CASCADE",
      },
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: "User",
          key: "userId",
        },
        onDelete: "CASCADE",
      },
      isConfirmed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "Participation",
      timestamps: true,
    }
  );

  return Participation;
};
