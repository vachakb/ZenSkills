const express = require("express");
const { getAllWorkshops, getWorkshopById } = require("../controllers/workshopController");
const { createWorkshop } = require("../controllers/workshopController");
const { updateWorkshop } = require("../controllers/workshopController");

const router = express.Router();

// Endpoint to fetch all workshops
router.get("/", getAllWorkshops);

// Endpoint to fetch workshop details by ID
router.get("/:id", getWorkshopById);

// Endpoint to create a new workshop
router.post("/", createWorkshop);

// Endpoint to update a workshop
router.put("/:id", updateWorkshop);

module.exports = router;