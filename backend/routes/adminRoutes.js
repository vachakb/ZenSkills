const {
  getMentorDetails,
  verifyMentor,
  getMentorsToVerify,
  deleteMentor,
} = require("../controllers/adminController");

const express = require("express");

const router = express.Router();

router.get("/mentors", getMentorsToVerify);
router.get("/mentor/:userId", getMentorDetails);
router.put("/mentor/:userId/verify", verifyMentor);
router.delete("/mentor/:userId", deleteMentor);

module.exports = router;
