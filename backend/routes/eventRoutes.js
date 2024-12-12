const express = require("express");
const {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    markAttendance,
    getEventAttendance,
    bookEvent,
    getUserRegisteredEvents,
  } = require("../controllers/eventController");

const router = express.Router();

// Endpoint to fetch all events
router.get("/", getAllEvents);

// Endpoint to fetch event details by ID
router.get("/:id", getEventById);

// Endpoint to create a new event
router.post("/", createEvent);

// Endpoint to book a event
router.post("/:id/book", bookEvent);

// Endpoint to update a event
router.put("/:id", updateEvent);

// Endpoint to delete a event
router.delete("/:id", deleteEvent);

// Endpoint to mark attendance for a event
router.post("/:id/attendance", markAttendance);

// Endpoint to get event attendance
router.get("/:id/attendance", getEventAttendance);

router.get("/registered/:userId", getUserRegisteredEvents);

module.exports = router;