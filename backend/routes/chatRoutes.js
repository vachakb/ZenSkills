const express = require("express");
const {
  getAllConversations,
  connect,
  saveAttachment,
  downloadAttachment,
} = require("../controllers/chatController");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.get("/conversations", getAllConversations);

router.post("/attachment", upload.single("attachment"), saveAttachment);

router.get("/attachment/:id", downloadAttachment);

router.ws("/connect", connect);

module.exports = router;
