const express = require("express");
const { getMentors } = require("../controllers/mentorController");

const router = express.Router();

// Endpoint to fetch mentors
router.get("/", getMentors);

module.exports = router;
