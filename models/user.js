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
        allowNull: true, // ✅ 소셜 유저 고려
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true, // ✅ 소셜 로그인 시 없음
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true, // ✅ 일부 소셜 유저는 이메일이 없을 수도 있음
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
      isSuperManager: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },

      // ✅ 소셜 로그인 관련 필드
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
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "User",
      timestamps: false,
    }
  );

  // ✅ 비밀번호 해싱은 일반 로그인 사용자만
  User.beforeCreate(async (user) => {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  });

  return User;
};
