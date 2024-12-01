const express = require("express");
const { getUserProfile } = require("../controllers/userController");
const { getTags } = require("../controllers/mentorController");
const { getJobDetails } = require("../controllers/jobController");
const { getJobs } = require("../controllers/jobController");
const { createJob } = require("../controllers/jobController");

const router = express.Router();

router.get("/profile", getUserProfile);

// Endpoint to fetch tags
router.get("/tags", getTags);

// Endpoint to fetch all jobs
router.get("/jobs/", getJobs);

// Endpoint to fetch a particular job
router.get("/jobs/:jobId", getJobDetails);

// Endpoint to create a new job
router.post("/jobs", createJob);

module.exports = router;
