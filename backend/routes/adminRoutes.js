const {
  getMentorDetails,
  verifyMentor,
  getMentors
} = require("../controllers/adminController");

const express = require("express");

const router = express.Router();

router.get("/mentor", getMentors)
router.get("/mentor/:userId", getMentorDetails);
router.put("/mentor/:userId/verify", verifyMentor);

module.exports = router;