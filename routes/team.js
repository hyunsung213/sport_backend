const express = require("express");
const router = express.Router();
const teamController = require("../controllers/teamController");

router.post("/", teamController.createTeam);
router.get("/:teamId", teamController.getTeamById);
router.get("/", teamController.getAllTeams);

module.exports = router;
