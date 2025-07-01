require("dotenv").config();
const express = require("express");
const { sequelize } = require("./models");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

// 라우터 불러오기
const userRoutes = require("./routes/user");
const placeRoutes = require("./routes/place");
const gameRoutes = require("./routes/game");
const optionRoutes = require("./routes/option");
const participationRoutes = require("./routes/participation");
const photoRoutes = require("./routes/photo");

// 미들웨어
app.use(express.json());

// 다른 도메인도 허용(프론트랑 연결)
app.use(
  cors({
    origin: "http://localhost:3000", // 프론트 주소
    credentials: true,
  })
);

// 라우터 연결
app.use("/users", userRoutes);
app.use("/places", placeRoutes);
app.use("/games", gameRoutes);
app.use("/options", optionRoutes);
app.use("/participations", participationRoutes);
app.use("/uploads", express.static("uploads"));

// 기본 라우터
app.get("/", (req, res) => {
  res.send("Hello World");
});

// DB 연결 및 서버 실행
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB 연결 성공");

    await sequelize.sync({ alter: true });
    console.log("✅ 테이블 동기화 완료");

    app.listen(PORT, () => {
      console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ 초기화 실패:", error);
  }
};

startServer();
