const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Rate = sequelize.define(
    "Rate",
    {
      rateId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "User",
          key: "userId",
        },
        onDelete: "CASCADE",
      },
      rateValue: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "Rate",
      timestamps: true,
    }
  );

  return Rate;
};
