const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Middleware to verify the JWT token
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1]; // Extract token

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user to the request object
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found, authorization denied" });
      }

      next(); // Proceed to the next middleware/controller
    } catch (error) {
      console.error("Invalid token:", error.message);
      res.status(401).json({ message: "Invalid token, authorization denied" });
    }
  } else {
    res.status(401).json({ message: "No token provided, authorization denied" });
  }
};

module.exports = { protect };
