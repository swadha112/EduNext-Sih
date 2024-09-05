const express = require("express");
const { getUserProfile } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware"); // Import the token middleware
const router = express.Router();

// Protected route to get user profile
router.get("/profile", protect, getUserProfile); // protect middleware checks token

module.exports = router;
