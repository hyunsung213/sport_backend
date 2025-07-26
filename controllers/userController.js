const { User } = require("../models");

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createUserForSocial = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "로그인 필요 또는 userId 누락" });
    }

    const { userName, phoneNum, city, isManager } = req.body;

    // 1. 사용자 정보 업데이트
    await User.update(
      { userName, phoneNum, city, isManager },
      { where: { userId } }
    );

    // 2. 갱신된 사용자 정보 다시 조회
    const updatedUser = await User.findByPk(userId);

    if (!updatedUser) {
      return res
        .status(404)
        .json({ message: "사용자 정보를 찾을 수 없습니다." });
    }

    // ✅ 프론트가 직접 저장하거나, refetchUser로 갱신하도록 유저 정보 응답
    res.json({
      message: "추가 정보 저장 완료",
      user: {
        userId: updatedUser.userId,
        userName: updatedUser.userName,
        email: updatedUser.email,
        isManager: updatedUser.isManager,
        isSuperManager: updatedUser.isSuperManager,
        isSupporter: updatedUser.isSupporter,
        isSocial: updatedUser.isSocial,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) res.json(user);
    else res.status(404).json({ error: "User not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyUser = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "로그인 필요 또는 userId 누락" });
    }

    const user = await User.findByPk(userId); // ✅ 이건 그대로 유지);

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    console.error("에러:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getSupporters = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "로그인 필요 또는 userId 누락" });
    }

    if (!req.user?.isSuperManager) {
      return res.status(401).json({ message: "당신은 슈펴관리자가 아닙니다." });
    }

    const supporters = await User.findAll({
      where: {
        isSupporter: true,
      },
    });

    if (supporters) {
      res.json(supporters);
    } else {
      res.status(404).json({ error: "Supporter not found" });
    }
  } catch (err) {
    console.error("에러:", err);
    res.status(500).json({ error: err.message });
  }
};

const bcrypt = require("bcrypt");

exports.updateUser = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "로그인 필요 또는 userId 누락" });
    }

    const { userName, phoneNum, password, city } = req.body;

    const updateFields = { userName, phoneNum, city };

    if (password) {
      // 🔐 비밀번호 해싱
      const hashedPassword = await bcrypt.hash(password, 10); // saltRounds = 10
      updateFields.password = hashedPassword;
    }

    const [updated] = await User.update(updateFields, { where: { userId } });

    if (updated) {
      res.json({ message: "User updated" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    console.error("User update error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.destroy({
      where: { userId: req.params.id },
    });
    if (deleted) res.json({ message: "User deleted" });
    else res.status(404).json({ error: "User not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
