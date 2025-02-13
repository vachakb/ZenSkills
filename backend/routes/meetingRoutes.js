const express = require("express");
const {
  getToken,
  createRoom,
  startRecording,
  stopRecording,
} = require("../controllers/meetingController");

const router = express.Router();

router.post("/token", getToken);

router.post("/room", createRoom);

router.post("/recordings/start", startRecording);

router.post("/recordings/stop", stopRecording);

module.exports = router;
