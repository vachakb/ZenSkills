const express = require("express");
const {
  createSession,
  getAllTopics,
  getAllAvailableSessions,
} = require("../controllers/sessionController");

const router = express.Router();

router.get("/", getAllAvailableSessions);

router.post("/", createSession);

router.get("/topics", getAllTopics);

module.exports = router;
