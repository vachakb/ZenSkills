const express = require("express");
const { getMentors, getMentorProfile } = require("../controllers/mentorController");

const router = express.Router();

// Endpoint to fetch mentors
router.get("/", getMentors);

// Endpoint to fetch mentor profile
router.get("/:mentorId", getMentorProfile);

module.exports = router;
