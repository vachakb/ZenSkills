const express = require("express");
const {
  getMentors,
  getMentorProfile,
  editProfile,
  getMentorsList,
  createReferral,
  updateReferralStatus,
  getAllReferrals,
} = require("../controllers/mentorController");
const {
  getReviewsByMentorId,
  addReview,
} = require("../controllers/reviewController");
const {
  getRecommendations,
} = require("../controllers/recommendationController");

const multer = require("multer");
const upload = multer({ dest: "uploads/files/" });

const router = express.Router();

// Endpoint to fetch mentors
router.get("/", getMentors);

router.get("/list", getMentorsList);

router.get("/referrals", getAllReferrals);

// Endpoint to fetch mentor profile
router.get("/:mentorId", getMentorProfile);

// Endpoint to edit mentor profile
router.put("/:mentorId/edit", editProfile);

// Endpoint to fetch reviews by mentor ID
router.get("/reviews/:mentorId", getReviewsByMentorId);
router.post("/reviews/:mentorId", addReview);

router.post("/recommendations", getRecommendations);

router.post(
  "/referral",
  upload.fields([{ name: "resume", maxCount: 1 }]),
  createReferral,
);

router.put("/referral", updateReferralStatus);

module.exports = router;
