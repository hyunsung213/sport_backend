const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// CRUD 라우터
router.post("/", userController.createUser); // CREATE
router.get("/", userController.getAllUsers); // READ 전체
router.get("/:id", userController.getUserById); // READ 단일
router.put("/:id", userController.updateUser); // UPDATE
router.delete("/:id", userController.deleteUser); // DELETE

module.exports = router;
