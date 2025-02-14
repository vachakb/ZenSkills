const jwt = require("jsonwebtoken");
const { default: fetch } = require("node-fetch");
const prisma = require("../models/prismaClient");

exports.getToken = (req, res) => {
  const { roomId } = req.body;

  const payload = {
    apikey: process.env.VIDEOSDK_API_KEY,
    permissions: ["allow_join", "allow_mod"],
  };

  if (roomId) {
    payload.roomId = roomId;
  }

  const token = jwt.sign(payload, process.env.VIDEOSDK_API_SECRET, {
    expiresIn: "120m",
    algorithm: "HS256",
  });

  res.json({ token });
};

exports.createRoom = (req, res) => {
  const { token } = req.body;

  const url = `${process.env.VIDEOSDK_API_ENDPOINT}/rooms`;

  const options = {
    method: "POST",
    headers: { Authorization: token },
  };

  fetch(url, options)
    .then((response) => response.json())
    .then((result) => {
      const { roomId } = result;
      res.json({ roomId });
    })
    .catch((error) => console.error("error", error));
};

exports.getAllRoomIds = async (req, res) => {
  const sessions = await prisma.SessionBooking.findMany({
    include: {
      session: true,
    },
    where: {
      user_id: req.user.id,
      status: "completed",
    },
  });

  res.json({ sessions });
};

exports.getMeetingRecording = (req, res) => {
  const { roomId } = req.params;
  const { token } = req.query;

  const url = `${process.env.VIDEOSDK_API_ENDPOINT}/recordings`;

  const searchParams = new URLSearchParams();
  searchParams.set("roomId", roomId);
  searchParams.set("perPage", 1000);

  const options = {
    method: "GET",
    headers: { Authorization: token, "Content-Type": "application/json" },
  };

  fetch(url + "?" + searchParams.toString(), options)
    .then((response) => response.json())
    .then((result) => {
      const recording = result.data[0].file;
      res.json({ fileUrl: recording.fileUrl });
    })
    .catch((error) => console.error(error));
};

exports.startRecording = (req, res) => {
  const { token, roomId } = req.body;

  const url = `${process.env.VIDEOSDK_API_ENDPOINT}/recordings/start`;

  const options = {
    method: "POST",
    headers: { Authorization: token, "Content-Type": "application/json" },
    body: JSON.stringify({
      roomId,
    }),
  };

  fetch(url, options)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

exports.stopRecording = (req, res) => {
  const { token, roomId } = req.body;

  const url = `${process.env.VIDEOSDK_API_ENDPOINT}/recordings/stop`;

  const options = {
    method: "POST",
    headers: { Authorization: token, "Content-Type": "application/json" },
    body: JSON.stringify({
      roomId,
    }),
  };

  fetch(url, options)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};
