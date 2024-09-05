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

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    // Find the user by ID from token
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = user.email;
      user.mobileNo = req.body.mobileNo || user.mobileNo;
      user.dob = req.body.dob || user.dob;
      user.gender = req.body.gender || user.gender;
      user.category = req.body.category || user.category;
      user.cv = req.body.cv || user.cv;
      user.marksheet = req.body.marksheet || user.marksheet;
      user.bio = req.body.bio || user.bio;
      user.interests = req.body.interests || user.interests;
      user.grade = req.body.grade || user.grade;
      user.stream = req.body.stream || user.stream;

      const updatedUser = await user.save();

      res.status(200).json({
        status: "success",
        message: "User profile updated successfully",
        data: updatedUser,
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
      message: "Server error while updating user profile",
    });
  }
};

module.exports = { getUserProfile, updateUserProfile };
