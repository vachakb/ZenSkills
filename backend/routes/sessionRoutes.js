const express = require("express");
const {
  createSession,
  getAllTopics,
  getAllAvailableSessions,
  updateSession,
} = require("../controllers/sessionController");

const router = express.Router();

router.get("/", getAllAvailableSessions);

router.post("/", createSession);

router.get("/topics", getAllTopics);

router.put("/:id", updateSession);

module.exports = router;
