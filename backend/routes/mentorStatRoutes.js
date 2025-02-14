const express = require("express");
const {
    totalMenteeMentored,
    totalSessionsConducted,
} = require("../controllers/mentorStatController");

const router = express.Router();

router.get("/totalMenteeMentored", totalMenteeMentored);
router.get("/totalSessionsConducted", totalSessionsConducted);

module.exports = router;