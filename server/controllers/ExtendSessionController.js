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
            { nic: payload.nic, email: payload.email,userType:payload.userType },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "3h" } // New short-lived token
          );
          res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 2 * 60 * 60 * 1000, // 7 days
            sameSite: "strict",
          });
          res.status(200).json({
            success: true,
            message:"Extend session successfull",
            accessTokenExpiresIn:3*60*60
          });
        } catch (error) {
          res.status(403).json({ success: false, message: "Invalid or expired refresh token" });
        }
      }
      
}
module.exports=ExtendSessionController;