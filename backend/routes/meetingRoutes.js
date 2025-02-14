const express = require("express");
const {
  getToken,
  createRoom,
  getAllRoomIds,
  getMeetingRecording,
  startRecording,
  stopRecording,
} = require("../controllers/meetingController");

const router = express.Router();

router.post("/token", getToken);

router.post("/room", createRoom);

router.get("/rooms", getAllRoomIds);

router.get("/recordings/:roomId", getMeetingRecording);

router.post("/recordings/start", startRecording);

router.post("/recordings/stop", stopRecording);

module.exports = router;
