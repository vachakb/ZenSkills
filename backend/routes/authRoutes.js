const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verifyEmail } = require("../controllers/emailVerificationController");
const {
  registerUserProfile,
} = require("../controllers/registerUserController");
const passport = require("passport");

// Login route
passport.use("local", authController.login);

// TODO error handling
router.post(
  "/login",
  passport.authenticate("local", { failWithError: true }),
  (_, res) => {
    res.statusCode(200);
  },
  (_, res) => {
    res.statusCode(500);
  },
);

// Google OAuth callback route
router.post("/google/callback", authController.googleCallback);

// Registration route
router.post("/register", authController.register);

// To register other fields of user like name, email, password
router.post("/register-user", registerUserProfile);

// Email verification route
router.get("/verify-email", verifyEmail);

module.exports = router;
