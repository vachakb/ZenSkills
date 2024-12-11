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
  updateTimeSlots,
  getAllUserSessions,
  setSessionRoomId,
} = require("../controllers/sessionController");

const router = express.Router();

router.get("/topics", getAllTopics);

router.get("/:id", getSession);

router.get("/list/:mentorId", getAllAvailableSessions);

router.get("/user/list", getAllUserSessions);

router.post("/", createSession);

router.put("/:id/room", setSessionRoomId);

router.post("/:bookingId/book", bookSession);

router.put("/:id", updateSession);

router.delete("/:id", deleteSession);

// Endpoint to update booking status
router.put("/:bookingId/status", updateBookingStatus);

// Endpoint to create time slots
router.post("/time-slots", createTimeSlots);

// Endpoint to get available time slots
router.get("/:sessionId/available-timeslots", getAvailableTimeSlots);

// Endpoint to update time slots
router.put("/:mentorId/time-slots", updateTimeSlots); // Add this line

module.exports = router;
