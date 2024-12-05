const express = require("express");
const { getUserProfile,deleteProfile } = require("../controllers/userController");
const { getTags } = require("../controllers/mentorController");



const router = express.Router();

router.get("/profile", getUserProfile);

// Endpoint to delete profile
router.delete("/profile/delete", deleteProfile);

// Endpoint to fetch tags
router.get("/tags", getTags);

module.exports = router;
