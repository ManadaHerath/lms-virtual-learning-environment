const jwt = require("jsonwebtoken");

const AuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    req.user = payload; // Attach user info to request
  
    next();
  } catch (error) {
    res.status(403).json({ success: false, message: "Token expired or invalid" });
  }
};

module.exports = AuthMiddleware;
