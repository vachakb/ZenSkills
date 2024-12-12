const express = require("express");
const { getMenteeProfile,editProfile, getMenteeStats } = require("../controllers/menteeController");

const router = express.Router();

// Endpoint to fetch menteeProfile
router.get("/:menteeId", getMenteeProfile);
router.get("/:menteeId/statistics", getMenteeProfile);
router.put("/:menteeId/edit", editProfile);


module.exports = router;
