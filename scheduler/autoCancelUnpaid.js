const cron = require("node-cron");
const { Participation } = require("../models");
const { Op } = require("sequelize");

const autoCancelUnpaid = async () => {
  const now = new Date();
  const fiveMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);

  try {
    const deletedCount = await Participation.destroy({
      where: {
        isConfirmed: false,
        createdAt: { [Op.lte]: fiveMinutesAgo },
      },
    });

    if (deletedCount > 0) {
      console.log(`[자동 취소] 결제되지 않은 신청 ${deletedCount}건 삭제됨`);
    }
  } catch (err) {
    console.error("자동 취소 실패:", err);
  }
};

// 1분마다 검사
cron.schedule("*/1 * * * *", autoCancelUnpaid);

module.exports = autoCancelUnpaid;
