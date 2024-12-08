const express = require("express");
const {
  createSession,
  getAllTopics,
  getAllAvailableSessions,
  updateSession,
  deleteSession,
  getSession,
} = require("../controllers/sessionController");

const router = express.Router();

router.get("/", getAllAvailableSessions);

router.get("/:id", getSession);

router.post("/", createSession);

router.get("/topics", getAllTopics);

router.put("/:id", updateSession);

router.delete("/:id", deleteSession);

module.exports = router;
