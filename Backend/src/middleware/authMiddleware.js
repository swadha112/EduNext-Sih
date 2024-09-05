const jwt = require("jsonwebtoken");

// Middleware to verify the JWT token
const protect = (req, res, next) => {
  let token;

  // Check if the authorization header exists and contains a Bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user id and email to the request object
      req.user = decoded;

      next(); // Call the next middleware/controller
    } catch (error) {
      res.status(401).json({ message: "Invalid token, authorization denied" });
    }
  }

  if (!token) {
    res
      .status(401)
      .json({ message: "No token provided, authorization denied" });
  }
};

module.exports = { protect };
