const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { getUserCoins, updateCoins } = require("../controllers/coinController");

const router = express.Router();

// Route to get user's coins and transaction history
router.get("/coins", protect, getUserCoins);

// Route to update user's coins
router.post("/update-coins", protect, updateCoins);

module.exports = router;
