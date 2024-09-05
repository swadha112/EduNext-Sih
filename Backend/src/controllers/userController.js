const User = require("../models/userModel");

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    // Find the user by ID from token
    const user = await User.findById(req.user.id).select("-password"); // Exclude password field

    if (user) {
      res.status(200).json({
        status: "success",
        message: "User profile retrieved successfully",
        data: user,
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Server error while retrieving user profile",
    });
  }
};

module.exports = { getUserProfile };
