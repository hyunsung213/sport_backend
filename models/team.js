const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Team = sequelize.define(
    "Team",
    {
      teamId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      playerA: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "User",
          key: "userId",
        },
        onDelete: "CASCADE",
      },
      playerB: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "User",
          key: "userId",
        },
        onDelete: "CASCADE",
      },
    },
    {
      tableName: "Team",
      timestamps: true,
    }
  );

  return Team;
};
