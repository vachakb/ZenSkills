const express = require("express");
const {
    totalMenteeMentored,
    totalSessionsConducted,
    menteesMentoredMonthWise,
    mentorRating,
    sessionDistribution,
    newMenteesMentoredPerMonth,
    totalRevenueEarned,
    monthlyRevenueTrend
} = require("../controllers/mentorStatController");

const router = express.Router();

router.get("/totalMenteeMentored", totalMenteeMentored);
router.get("/totalSessionsConducted", totalSessionsConducted);
router.get("/menteesMentoredMonthWise", menteesMentoredMonthWise);
router.get("/mentorRating", mentorRating);
router.get("/sessionDistribution", sessionDistribution);
router.get("/newMenteesMentoredPerMonth", newMenteesMentoredPerMonth);
router.get("/totalRevenueEarned", totalRevenueEarned);
router.get("/monthlyRevenueTrend", monthlyRevenueTrend);

module.exports = router;