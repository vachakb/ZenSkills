const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const {
  registerUserProfile,
} = require("../controllers/registerUserController");
const passport = require("passport");
const { verify } = require("crypto");
const { validation } = require("../middlewares/validation");
const MagicLinkStrategy = require("passport-magic-link").Strategy;
const yup = require("yup");

passport.serializeUser((user, done) => {
  process.nextTick(() => {
    done(null, { userId: user.id, email: user.email, role: user.role });
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
  validation(
    yup.object({
      email: yup
        .string()
        .email("Must be a valid email")
        .required("This is a required field"),
      password: yup
        .string()
        .required("This is a required field")
        .min(8, "Password should be at least 8 characters"),
      role: yup.string().oneOf(["mentor", "mentee"], null).required(),
    }),
  ),
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
router.post(
  "/register",
  validation(
    yup.object({
      email: yup
        .string()
        .email("Must be a valid email")
        .required("This is a required field"),
      password: yup
        .string()
        .required("This is a required field")
        .min(8, "Password should be at least 8 characters"),
      phoneNum: yup
        .string()
        .required("This is a required field")
        .test(
          "is-valid-phone",
          "Phone number is invalid",
          (value) => value && value.length >= 10, // Or use a regex for more accuracy
        ),
    }),
  ),
  authController.register,
);

// To register other fields of user like name, email, password
router.post("/register-user", registerUserProfile);

module.exports = router;
