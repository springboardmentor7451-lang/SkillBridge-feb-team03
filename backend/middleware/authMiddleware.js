const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token;

  // Check for token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user id to request
      req.user = decoded.id;

      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Authorize specific roles
const authorizeRole = (...roles) => {
  return async (req, res, next) => {
    try {
      const User = require("../models/user");
      const user = await User.findById(req.user);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({
          message: `Only ${roles.join(", ")} can access this resource`,
        });
      }

      req.userRole = user.role;
      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};

module.exports = { protect, authorizeRole };
