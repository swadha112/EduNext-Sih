const User = require("../models/userModel");

// Update user coins
const updateCoins = async (req, res) => {
  const { coins } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }

    user.coins += coins;
    await user.save();

    res.status(200).json({ status: "success", message: "Coins updated successfully", coins: user.coins });
  } catch (error) {
    res.status(500).json({ status: "fail", message: "Error updating coins", error: error.message });
  }
};

// Get user coins and transactions
const getUserCoins = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }

    res.status(200).json({
      coins: user.coins,
      transactions: user.notifications || [], // Return transactions stored as notifications
    });
  } catch (error) {
    res.status(500).json({ status: "fail", message: "Error fetching coin data", error: error.message });
  }
};

module.exports = { updateCoins, getUserCoins };
