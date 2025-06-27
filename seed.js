const {
  sequelize,
  User,
  Place,
  Option,
  Game,
  Participation,
} = require("./models");

const seed = async () => {
  try {
    await sequelize.sync({ force: true }); // 기존 데이터 전체 삭제 후 재생성

    // User 데이터 생성
    const users = [];
    for (let i = 1; i <= 10; i++) {
      users.push(
        await User.create({
          userName: `User${i}`,
          nickname: `Nick${i}`,
          password: `pass${i}`,
          email: `user${i}@test.com`,
          phoneNum: `010-0000-00${i}`,
          isManager: Math.random() < 0.5,
          grade: Math.floor(Math.random() * (2000 - 500 + 1)) + 500,
        })
      );
    }

    // Place 데이터 생성
    const places = [];
    const addressList = [
      "서울특별시 강서구 강서로 348",
      "서울특별시 강서구 강서로41길 42",
      "서울특별시 강남구 언주로 631",
      "서울특별시 강남구 삼성로120길 46",
      "서울특별시 용산구 청파로 359-4",
      "서울특별시 용산구 청파동 청파로67길 7",
      "서울특별시 중구 퇴계로 387",
      "서울특별시 성동구 마조로 47",
      "서울특별시 종로구 자하문로 309",
      "서울특별시 노원구 월계동 68-79",
      "서울특별시 노원구 화랑로47길 9",
    ];
    const managerUsers = users.filter((u) => u.isManager);
    for (let i = 1; i <= 10; i++) {
      places.push(
        await Place.create({
          placeName: `Place${i}`,
          location: addressList[i],
          managerId:
            managerUsers[Math.floor(Math.random() * managerUsers.length)]
              .userId,
        })
      );
    }

    // Option 데이터 생성
    for (let i = 0; i < 10; i++) {
      await Option.create({
        placeId: places[i].placeId,
        isToilet: Math.random() < 0.5,
        isShowerRoom: Math.random() < 0.5,
        isParkingLot: Math.random() < 0.5,
        isShuttlecock: Math.random() < 0.5,
        isIndoor: Math.random() < 0.5,
      });
    }

    // Game 데이터 생성
    const games = [];
    const startDate = new Date("2024-06-27T00:00:00");
    const endDate = new Date("2024-07-10T23:59:59");
    const randomDate = new Date(
      startDate.getTime() +
        Math.random() * (endDate.getTime() - startDate.getTime())
    );
    for (let i = 1; i <= 10; i++) {
      games.push(
        await Game.create({
          placeId: places[Math.floor(Math.random() * places.length)].placeId,
          date: randomDate,
          numOfMember: Math.floor(Math.random() * (8 - 4 + 1)) + 4,
        })
      );
    }

    // Participation 데이터 생성
    for (let i = 0; i < 10; i++) {
      await Participation.create({
        userId: users[Math.floor(Math.random() * users.length)].userId,
        gameId: games[Math.floor(Math.random() * games.length)].gameId,
      });
    }

    console.log("✅ 샘플 데이터 삽입 완료");
    process.exit();
  } catch (err) {
    console.error("❌ 샘플 데이터 삽입 실패:", err);
    process.exit(1);
  }
};

seed();
