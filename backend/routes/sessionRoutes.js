const express = require("express");
const {
  createSession,
  getAllTopics,
  getAllAvailableSessions,
  updateSession,
  deleteSession,
} = require("../controllers/sessionController");

const router = express.Router();

router.get("/", getAllAvailableSessions);

router.post("/", createSession);

router.get("/topics", getAllTopics);

router.put("/:id", updateSession);

router.delete("/:id", deleteSession);

module.exports = router;
