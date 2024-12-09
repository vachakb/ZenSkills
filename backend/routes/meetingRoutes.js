const express = require("express");
const { getToken, createRoom } = require("../controllers/meetingController");

const router = express.Router();

router.post("/token", getToken);

router.post("/room", createRoom);

module.exports = router;
