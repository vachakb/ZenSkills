const jwt = require("jsonwebtoken");
const { default: fetch } = require("node-fetch");

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
