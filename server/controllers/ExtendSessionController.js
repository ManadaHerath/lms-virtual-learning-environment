const jwt = require("jsonwebtoken");

const ExtendSessionController={
    extendSession:async (req, res) => {
        const refreshToken = req.cookies.refreshToken; // Extract Refresh Token from cookie
      
        if (!refreshToken) {
          return res.status(401).json({ success: false, message: "No refresh token provided" });
        }
      
        try {
          // Verify the Refresh Token
          const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
          
          // Generate a new Access Token
          const accessToken = jwt.sign(
            { nic: payload.nic, email: payload.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" } // New short-lived token
          );
      
          res.status(200).json({
            success: true,
            accessToken,
          });
        } catch (error) {
          res.status(403).json({ success: false, message: "Invalid or expired refresh token" });
        }
      }
      
}
module.exports=ExtendSessionController;