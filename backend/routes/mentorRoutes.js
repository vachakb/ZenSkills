const express = require("express");
const { getMentors, getMentorProfile } = require("../controllers/mentorController");
const { getReviewsByMentorId, addReview } = require("../controllers/reviewController");


const router = express.Router();

// Endpoint to fetch mentors
router.get("/", getMentors);

// Endpoint to fetch mentor profile
router.get("/:mentorId", getMentorProfile);

// Endpoint to fetch reviews by mentor ID
router.get("/reviews/:mentorId", getReviewsByMentorId);
router.post("/reviews/:mentorId", addReview);

module.exports = router;
