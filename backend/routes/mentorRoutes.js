const express = require("express");
const { getMentors, getMentorProfile,editProfile} = require("../controllers/mentorController");
const { getReviewsByMentorId, addReview } = require("../controllers/reviewController");
const { getRecommendations } = require("../controllers/recommendationController");


const router = express.Router();

// Endpoint to fetch mentors
router.get("/", getMentors);

// Endpoint to fetch mentor profile
router.get("/:mentorId", getMentorProfile);

// Endpoint to edit mentor profile
router.put("/:mentorId/edit", editProfile);


// Endpoint to fetch reviews by mentor ID
router.get("/reviews/:mentorId", getReviewsByMentorId);
router.post("/reviews/:mentorId", addReview);

router.post("/recommendations", getRecommendations);

module.exports = router;
