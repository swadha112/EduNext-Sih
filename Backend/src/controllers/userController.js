const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id, email) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Register user
const registerUser = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const user = await User.create({ email, password, name });
    const token = generateToken(user._id, user.email);
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const isMatch = await user.matchPassword(password);
  if (user && isMatch) {
    const token = generateToken(user._id, user.email);
    res.status(200).json({ token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select("-password");
  res.json(user);
};

module.exports = { registerUser, loginUser, getUserProfile };
