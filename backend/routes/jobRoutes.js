const express = require("express");

const { getJobDetails,
    getJobs,
    createJob,
    updateJob,
    deleteJob,
    applyJob 
} = require("../controllers/jobController");
const router = express.Router();

// Endpoint to fetch all jobs
router.get("/", getJobs);

// Endpoint to fetch a particular job
router.get("/:jobId", getJobDetails);

// Endpoint to create a new job
router.post("/", createJob);

// Endpoint to update a job
router.put("/:jobId", updateJob);

// Endpoint to delete a job
router.delete("/:jobId", deleteJob);

// Endpoint to apply for a job
router.post("/:jobId/apply", applyJob);
module.exports = router;
