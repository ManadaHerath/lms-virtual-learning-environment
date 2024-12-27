const jwt = require("jsonwebtoken");

const AuthMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      // Check if the user's role is in the allowed roles
      if (!allowedRoles.includes(payload.userType)) {
        return res.status(403).json({ success: false, message: "Forbidden: Insufficient permissions" });
      }

      req.user = payload; // Attach user info to request
      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      res.status(403).json({ success: false, message: "Token expired or invalid" });
    }
  };
};

module.exports = AuthMiddleware;
