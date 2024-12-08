const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1]; // Extract token

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch the user from the database
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ success: false, message: "User not found, authorization denied" });
      }

      next(); // Proceed to the next middleware/controller
    } catch (error) {
      console.error("Token verification failed:", error.message);
      res.status(401).json({ success: false, message: "Invalid token, authorization denied" });
    }
  } else {
    res.status(401).json({ success: false, message: "No token provided, authorization denied" });
  }
};

module.exports = { protect };
