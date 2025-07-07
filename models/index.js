const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("mydb", "devuser", "devpass", {
  host: "localhost",
  dialect: "mysql", // mariadb도 가능
  port: 3306,
  logging: false,
});

// 모델 불러오기
const User = require("./user")(sequelize);
const Place = require("./place")(sequelize);
const Game = require("./game")(sequelize);
const Participation = require("./participation")(sequelize);
const Interest = require("./interest")(sequelize);
const Note = require("./note")(sequelize);
const Option = require("./option")(sequelize);
const Photo = require("./photo")(sequelize);
const Rate = require("./rate")(sequelize);
// 관계 설정

// 1. Place - Game (1:N)
Place.hasMany(Game, { foreignKey: "placeId" });
Game.belongsTo(Place, { foreignKey: "placeId" });

// 2. Place - Option (1:1)
Place.hasOne(Option, { foreignKey: "placeId" });
Option.belongsTo(Place, { foreignKey: "placeId" });

// 3. Place - User (관리자 관계) (1:N)
User.hasMany(Place, { foreignKey: "managerId" });
Place.belongsTo(User, { foreignKey: "managerId" });

// 4. Game - Participation - User (N:N 관계)
Game.belongsToMany(User, { through: Participation, foreignKey: "gameId" });
User.belongsToMany(Game, { through: Participation, foreignKey: "userId" });

// 5. Game - Interest - User (N:N 관계)
User.belongsToMany(Game, { through: Interest, foreignKey: "userId" });
Game.belongsToMany(User, { through: Interest, foreignKey: "gameId" });

// Interest에서 개별 조회 가능하게 설정
Interest.belongsTo(Game, { foreignKey: "gameId" });
Interest.belongsTo(User, { foreignKey: "userId" });

// 6. Place - Photo (1:N 관계)
Place.hasMany(Photo, { foreignKey: "placeId", onDelete: "CASCADE" });
Photo.belongsTo(Place, { foreignKey: "placeId" });

// 7. Place - Note (1:N 관계)
Place.hasOne(Note, { foreignKey: "placeId", onDelete: "CASCADE" });
Note.belongsTo(Place, { foreignKey: "placeId" });

// 8. User - Rate 1:1 관계
User.hasOne(Rate, { foreignKey: "userId", onDelete: "CASCADE" });
Rate.belongsTo(User, { foreignKey: "userId" });

// 추가적으로 Participation에서 Game, User로 접근 가능하게 설정
Participation.belongsTo(Game, { foreignKey: "gameId" });
Participation.belongsTo(User, { foreignKey: "userId" });
Game.hasMany(Participation, { foreignKey: "gameId" });
User.hasMany(Participation, { foreignKey: "userId" });

module.exports = {
  sequelize,
  User,
  Place,
  Game,
  Participation,
  Option,
  Photo,
  Interest,
  Note,
  Rate,
};
