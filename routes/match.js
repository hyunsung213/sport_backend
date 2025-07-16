const express = require("express");
const router = express.Router();
const matchController = require("../controllers/matchController");

router.post("/", matchController.createMatch);
router.get("/:matchId", matchController.getMatchById);
router.get("/", matchController.getAllMatches);
router.put("/:matchId", matchController.putMatchById);

module.exports = router;
