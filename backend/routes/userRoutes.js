const express = require('express');
const { getUserProfile } = require('../controllers/userController'); // Ensure this function is properly imported

const router = express.Router();

router.get('/profile', getUserProfile);

module.exports = router;
