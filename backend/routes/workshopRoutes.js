const express = require("express");
const {
    getAllWorkshops,
    getWorkshopById,
    createWorkshop,
    bookWorkshop,
    updateWorkshop,
    deleteWorkshop,
    markAttendance,
    getWorkshopAttendance,
  

  } = require("../controllers/workshopController");

const router = express.Router();

// Endpoint to fetch all workshops
router.get("/", getAllWorkshops);

// Endpoint to fetch workshop details by ID
router.get("/:id", getWorkshopById);

// Endpoint to create a new workshop
router.post("/", createWorkshop);

// Endpoint to book a workshop
router.post("/:id/book", bookWorkshop);

// Endpoint to update a workshop
router.put("/:id", updateWorkshop);

// Endpoint to delete a workshop
router.delete("/:id", deleteWorkshop);

// Endpoint to mark attendance for a workshop
router.post("/:id/attendance", markAttendance);

// Endpoint to get workshop attendance
router.get("/:id/attendance", getWorkshopAttendance);


module.exports = router;