const express = require("express");
const { getMenteeProfile } = require("../controllers/menteeController");

const router = express.Router();

// Endpoint to fetch menteeProfile
router.get("/:menteeId", getMenteeProfile);
router.get("/:menteeId/statistics", getMenteeProfile);

module.exports = router;
