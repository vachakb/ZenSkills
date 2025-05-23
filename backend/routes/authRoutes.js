const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

const {
  registerUserProfile,
} = require("../controllers/registerUserController");
const passport = require("passport");
const { validation } = require("../middlewares/validation");
const { protected } = require("../middlewares/protected");
const MagicLinkStrategy = require("passport-magic-link").Strategy;
const CustomStrategy = require("passport-custom").Strategy;
const yup = require("yup");
const { languages } = require("../misc/languages");
const { states } = require("../misc/states");
const multer = require("multer");
const upload = multer({ dest: "uploads/file/" });

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
  validation(() => {
    return yup.object({
      email: yup
        .string()
        .email("Must be a valid email")
        .required("This is a required field"),
      password: yup
        .string()
        .required("This is a required field")
        .min(8, "Password should be at least 8 characters"),
      role: yup.string().oneOf(["mentor", "mentee"], null).required(),
    });
  }),
  passport.authenticate("local", { failWithError: true }),
  (req, res) => {
    res.status(200).json({
      email: req.body.email,
      role: req.body.role,
    });
  },
  (err, req, res, next) => {
    res.status(500).json({ message: err });
  },
);

passport.use(
  new MagicLinkStrategy(
    {
      secret: process.env.AUTH_SECRET,
      userFields: ["email", "role"],
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
  (req, res) => {
    res.json({ role: req.user.role });
  },
  (_, res) => {
    res.sendStatus(500);
  },
);

passport.use("google", new CustomStrategy(authController.googleCallback));

router.post(
  "/google/callback",
  passport.authenticate("google", { failWithError: true }),
  (req, res) => {
    res.json({ isRegistered: req.isRegistered });
  },
  (err, req, res, next) => {
    res.status(500).json({ message: err });
  },
);

// Registration route
router.post(
  "/register",
  validation(() => {
    return yup.object({
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
      role: yup.string().oneOf(["mentor", "mentee"], null).required(),
    });
  }),
  authController.register,
);

// To register other fields of user like name, email, password
router.post(
  "/register-user",
  protected,
  validation((req) => {
    return yup.object({
      name: yup.string().required(),
      gender: yup.string().oneOf(["Male", "Female", "Other"]).required(),
      language: yup.string().oneOf(languages),
      location: yup.string().oneOf(states),
      company: yup.string().when([], {
        is: () => req.user.role === "mentor",
        then: (schema) => schema.required(),
      }),
      title: yup.string().required(),
      years: yup.number().when([], {
        is: () => req.user.role === "mentor",
        then: (schema) => schema.integer().min(0).required(),
      }),
      months: yup.number().when([], {
        is: () => req.user.role === "mentor",
        then: (schema) => schema.integer().min(0).required(),
      }),
      companyOrSchool: yup.string(),
      expertise: yup
        .array()
        .nullable()
        .when([], {
          is: () => req.user.role == "mentor",
          then: (schema) => schema.required(),
        }),
      interests: yup
        .array()
        .nullable()
        .when([], {
          is: () => req.user.role == "mentee",
          then: (schema) => schema.required(),
        }),
      bio: yup.string(),
    });
  }),
  registerUserProfile,
);

router.post("/logout", authController.logout);

const documentsUpload = upload.fields([
  { name: "government_id", maxCount: 1 },
  { name: "degree_certificate", maxCount: 1 },
  { name: "additional_file", maxCount: 1 },
]);

router.post("/file", documentsUpload, authController.uploadDocuments);

router.get("/file/:id", authController.getDocument);

module.exports = router;
