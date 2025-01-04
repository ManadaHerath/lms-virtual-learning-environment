const jwt = require("jsonwebtoken");

const AuthMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    const token = req.cookies.accessToken;

    try {
      const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      if (!allowedRoles.includes(payload.userType)) {
        return res
          .status(403)
          .json({ success: false, message: "Forbidden: Insufficient permissions" });
      }

      req.user = payload;
      next();
    } catch (error) {
      console.log("Auth error:", error.message);
      res.status(403).json({ success: false, message: "Token expired or invalid" });
    }
  };
};


module.exports = AuthMiddleware;


