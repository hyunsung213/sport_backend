const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Place = sequelize.define(
    "Place",
    {
      placeId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      placeName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      managerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "User",
          key: "userId",
        },
      },
    },
    {
      tableName: "Place",
      timestamps: false,
    }
  );

  return Place;
};
