const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nickname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: DataTypes.STRING,
      phoneNum: DataTypes.STRING,
      isManager: DataTypes.BOOLEAN,
      grade: DataTypes.INTEGER,
    },
    {
      tableName: "User",
      timestamps: false,
    }
  );

  return User;
};
