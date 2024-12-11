const {
  getMentorDetails,
  verifyMentor,
} = require("../controllers/adminController");

const express = require("express");

const router = express.Router();

router.get("/mentor/:userId", getMentorDetails);
router.put("/mentor/:userId/verify", verifyMentor);

module.exports = router;
