const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");
const userController = require("../controllers/userController");

// Get user profile
router.get("/profile", verifyToken, userController.getUserProfile);

module.exports = router;
