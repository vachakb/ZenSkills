const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const {
  registerUserProfile,
} = require("../controllers/registerUserController");
const passport = require("passport");
const { verify } = require("crypto");
const MagicLinkStrategy = require("passport-magic-link").Strategy;

passport.serializeUser((user, done) => {
  process.nextTick(() => {
    done(null, { id: user.id, email: user.email, role: user.role });
  });
});

passport.deserializeUser((user, done) => {
  process.nextTick(() => {
    done(null, user);
  });
});

// Login route
passport.use("local", authController.login);

// TODO error handling
router.post(
  "/login",
  passport.authenticate("local", { failWithError: true }),
  (_, res) => {
    res.sendStatus(200);
  },
  (_, res) => {
    res.sendStatus(500);
  },
);

passport.use(
  new MagicLinkStrategy(
    {
      secret: process.env.AUTH_SECRET,
      userFields: ["email"],
      tokenField: "token",
      verifyUserAfterToken: true,
    },
    authController.sendEmail,
    authController.verifyEmail,
  ),
);

router.post(
  "/verify",
  passport.authenticate("magiclink", {
    action: "requestToken",
    failWithError: true,
  }),
  (_, res) => {
    console.log(res);
    res.sendStatus(200);
  },
  (_, res) => {
    res.sendStatus(500);
  },
);

router.get(
  "/verify/callback",
  passport.authenticate("magiclink", {
    action: "acceptToken",
    failWithError: true,
  }),
  (_, res) => {
    res.sendStatus(200);
  },
  (_, res) => {
    res.sendStatus(500);
  },
);

// Google OAuth callback route
router.post("/google/callback", authController.googleCallback);

// Registration route
router.post("/register", authController.register);

// To register other fields of user like name, email, password
router.post("/register-user", registerUserProfile);

module.exports = router;
