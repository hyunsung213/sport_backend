const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("mydb", "devuser", "devpass", {
  host: "localhost",
  dialect: "mysql", // 또는 'mariadb'
  port: 3306,
});

module.exports = sequelize;
