const express = require("express");
const router = express.Router();
const authController = require("../controllers/authcontroller");

// Login route
router.post("/login", authController.login);

// Google OAuth callback route
router.post("/google/callback", authController.googleCallback);

// Registration route
router.post("/register", authController.register);

module.exports = router;
