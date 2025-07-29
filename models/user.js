const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

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
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phoneNum: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isManager: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      isSupporter: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      isSuperManager: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      kakaoId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      googleId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isSocial: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
    {
      tableName: "User", // 또는 "Users", 또는 user (소문자)
      timestamps: false,
    }
  );

  return User;
};
