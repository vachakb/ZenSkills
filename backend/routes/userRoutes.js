const express = require("express");
const {
  getUserProfile,
  deleteProfile,
  uploadImage,
  getImage,
  editProfile,
  getCoins,
} = require("../controllers/userController");
const { getTags } = require("../controllers/mentorController");

const multer = require("multer");
const upload = multer({ dest: "uploads/images/" });

const router = express.Router();

router.get("/profile", getUserProfile);

// Endpoint to delete profile
router.delete("/profile/delete", deleteProfile);

// Endpoint to fetch tags
router.get("/tags", getTags);

router.put("/profile", editProfile);

router.post("/image", upload.single("file"), uploadImage);

router.get("/images/:id", getImage);

router.get("/coins", getCoins);

module.exports = router;
