const express = require("express");
const { getUserProfile } = require("../controllers/userController");
const { getTags } = require("../controllers/mentorController");

const router = express.Router();

// router.get("/profile", getUserProfile);

// Endpoint to fetch tags
router.get("/tags", getTags);
module.exports = router;
