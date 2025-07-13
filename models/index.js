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
const Team = require("./team")(sequelize);
const Match = require("./match")(sequelize);

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

// 9. User - Team (개별 선수)
Team.belongsTo(User, { foreignKey: "playerA", as: "PlayerA" });
Team.belongsTo(User, { foreignKey: "playerB", as: "PlayerB" });
User.hasMany(Team, { foreignKey: "playerA", as: "TeamsAsPlayerA" });
User.hasMany(Team, { foreignKey: "playerB", as: "TeamsAsPlayerB" });

// 10. Team - Match (경기 팀) 1:N 관계
Match.belongsTo(Team, { foreignKey: "teamA", as: "TeamA" });
Match.belongsTo(Team, { foreignKey: "teamB", as: "TeamB" });
Team.hasMany(Match, { foreignKey: "teamA", as: "MatchesAsTeamA" });
Team.hasMany(Match, { foreignKey: "teamB", as: "MatchesAsTeamB" });

// 11. User - Match (MVP 선수) 1:N 관계
Match.belongsTo(User, { foreignKey: "playerOfMatch", as: "MVP" });
User.hasMany(Match, { foreignKey: "playerOfMatch", as: "MvpMatches" });

// 12. Game - Match 관계
Match.belongsTo(Game, { foreignKey: "gameId" });
Game.hasMany(Match, { foreignKey: "gameId" });

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
  Team,
  Match,
};
