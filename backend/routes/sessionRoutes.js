const express = require("express");
const {
  createSession,
  getAllTopics,
  getAllAvailableSessions,
  updateSession,
  deleteSession,
  getSession,
  bookSession,
  updateBookingStatus,
  getAvailableTimeSlots,
  createTimeSlots,
} = require("../controllers/sessionController");

const router = express.Router();

router.get("/", getAllAvailableSessions);

router.post("/", createSession);

router.post("/:sessionId/book", bookSession);

router.get("/topics", getAllTopics);

router.get("/:id", getSession);

router.put("/:id", updateSession);

router.delete("/:id", deleteSession);


// Endpoint to update booking status
router.put("/:bookingId/status", updateBookingStatus);

// Endpoint to create time slots
router.post("/:sessionId/time-slots", createTimeSlots);

// Endpoint to get available time slots
router.get("/:sessionId/available-timeslots", getAvailableTimeSlots);

module.exports = router;
