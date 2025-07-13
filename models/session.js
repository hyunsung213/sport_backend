const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const sequelize = require("./models").sequelize; // Sequelize 인스턴스

const sessionStore = new SequelizeStore({
  db: sequelize,
});

sessionStore.sync(); // 테이블 자동 생성
