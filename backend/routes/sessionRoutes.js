const express = require("express");
const {
  createSession,
  getAllTopics,
  getAllAvailableSessions,
  updateSession,
  deleteSession,
  getSession,
  bookSession,
} = require("../controllers/sessionController");

const router = express.Router();

router.get("/", getAllAvailableSessions);

router.post("/", createSession);

router.post("/:timeSlotId", bookSession);

router.get("/topics", getAllTopics);

router.get("/:id", getSession);

router.put("/:id", updateSession);

router.delete("/:id", deleteSession);

module.exports = router;
