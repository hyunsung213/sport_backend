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
    const sessionUserId = req.session?.user?.id;
    if (!sessionUserId) return res.status(401).json({ message: "로그인 필요" });
    const { userName, phoneNum, city, isManager } = req.body;

    await User.update(
      { userName, phoneNum, city, isManager },
      { where: { userId: sessionUserId } }
    );

    // 2. 갱신된 사용자 정보 다시 조회
    const updatedUser = await User.findByPk(sessionUserId);

    // 3. 세션에 덮어쓰기
    req.session.user = {
      id: updatedUser.userId,
      userName: updatedUser.userName,
      email: updatedUser.email,
      isManager: updatedUser.isManager,
      isSuperManager: updatedUser.isSuperManager,
      isSocial: updatedUser.isSocial,
    };

    res.json({ message: "추가 정보 저장 완료" });
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
    const sessionUserId = req.session?.user?.id;

    if (!sessionUserId) {
      return res.status(401).json({ message: "로그인 필요 또는 userId 누락" });
    }
    const user = await User.findByPk(sessionUserId); // ✅ 이건 그대로 유지);

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

exports.updateUser = async (req, res) => {
  try {
    const [updated] = await User.update(req.body, {
      where: { userId: req.params.id },
    });
    if (updated) res.json({ message: "User updated" });
    else res.status(404).json({ error: "User not found" });
  } catch (err) {
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
