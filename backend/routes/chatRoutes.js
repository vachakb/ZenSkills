const express = require("express");
const {
  getAllConversations,
  connect,
} = require("../controllers/chatController");

const router = express.Router();

router.get("/conversations", getAllConversations);

router.ws("/connect", connect);

module.exports = router;
