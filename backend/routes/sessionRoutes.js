const express = require("express");

const router = express.Router();

router.post("/session", createSession);

module.exports = router;
