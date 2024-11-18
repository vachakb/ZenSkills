const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verifyEmail } = require("../controllers/emailVerificationController");
const {
  registerUserProfile,
} = require("../controllers/registerUserController");

// Login route
router.post("/login", authController.login);

// Google OAuth callback route
router.post("/google/callback", authController.googleCallback);

// Registration route
router.post("/register", authController.register);

// To register other fields of user like name, email, password
router.post("/register-user", registerUserProfile);

// Email verification route
router.get("/verify-email", verifyEmail);

module.exports = router;
