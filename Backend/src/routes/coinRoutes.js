const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { updateCoins, getUserCoins } = require("../controllers/coinController");

const router = express.Router();

// Route to update coins for a user
router.post("/update-coins", protect, updateCoins);

// Route to get user's coin balance and transaction history
router.get("/coins", getUserCoins);

module.exports = router;
