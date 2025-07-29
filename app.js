require("dotenv").config();
const express = require("express"); // ✅ 정상 express import
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
const interestRoutes = require("./routes/interest");
const authRoutes = require("./routes/auth");
const noteRoutes = require("./routes/note");
const rateRoutes = require("./routes/rate");
const teamRoutes = require("./routes/team");
const matchRoutes = require("./routes/match");

// 스케쥴러 불러오기
require("./scheduler/autoCancelUnpaid");

// 미들웨어
app.use(express.json());

app.use(
  cors({
    origin: "https://sport-client-43456.vercel.app/", // 프론트 주소
    credentials: true,
  })
);

// 정적 파일 서비스
app.use("/uploads", express.static("uploads"));

// 라우터 연결
app.use("/users", userRoutes);
app.use("/places", placeRoutes);
app.use("/games", gameRoutes);
app.use("/options", optionRoutes);
app.use("/participations", participationRoutes);
app.use("/interests", interestRoutes);
app.use("/auth", authRoutes);
app.use("/notes", noteRoutes);
app.use("/rates", rateRoutes);
app.use("/teams", teamRoutes);
app.use("/matches", matchRoutes);
app.use("/photos", photoRoutes);

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
