const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// CRUD 라우터
// CREATE
router.post("/", userController.createUser);
router.put("/social", userController.createUserForSocial); // ← 먼저!

// READ (특수 경로 먼저)
router.get("/my", userController.getMyUser); // ← 먼저!
router.get("/supporters", userController.getSupporters);
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById); // ← 마지막에!

// UPDATE / DELETE
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
