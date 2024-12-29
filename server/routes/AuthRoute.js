const express = require("express");
const AuthController = require("../controllers/AuthController");
const upload = require("../config/multer");

const router = express.Router();



// Signup route with image upload
router.post("/signup", upload.single("image"), (req, res) => {
    
     // Log the form data
    console.log("Uploaded file:", req.file); // Log the file metadata (if any)
    
    // Call the signup controller
    AuthController.createUser(req, res);
  });

// Login route
router.post("/login", AuthController.loginUser);

// Logout route
router.get("/logout", AuthController.logoutUser);


module.exports = router;
