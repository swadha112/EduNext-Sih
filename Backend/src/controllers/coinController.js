const User = require("../models/userModel");

// Get user coins and transaction history
const getUserCoins = async (req, res) => {
  try {
    // Ensure req.user is available from the protect middleware
    if (!req.user || !req.user.id) {
      return res.status(401).json({ status: "fail", message: "Unauthorized access" });
    }

    // Fetch the user from the database
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }

    // Return coins and notifications
    res.status(200).json({
      status: "success",
      coins: user.coins,
      transactions: user.notifications || [],
    });
  } catch (error) {
    console.error("Error fetching coin data:", error.message);
    res.status(500).json({ status: "fail", message: "Error fetching coin data", error: error.message });
  }
};

// Update user coins
const updateCoins = async (req, res) => {
  const { coins } = req.body; // Expecting the number of coins to add

  try {
    // Ensure req.user is available from the protect middleware
    if (!req.user || !req.user.id) {
      return res.status(401).json({ status: "fail", message: "Unauthorized access" });
    }

    // Fetch the user from the database
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }

    // Validate the coins input
    if (typeof coins !== "number" || coins < 0) {
      return res.status(400).json({ status: "fail", message: "Invalid coins value" });
    }

    // Update the user's coins
    user.coins += coins;
    await user.save();

    // Return the updated coin balance
    res.status(200).json({
      status: "success",
      message: "Coins updated successfully",
      coins: user.coins,
    });
  } catch (error) {
    console.error("Error updating coins:", error.message);
    res.status(500).json({ status: "fail", message: "Error updating coins", error: error.message });
  }
};

module.exports = { getUserCoins, updateCoins };
