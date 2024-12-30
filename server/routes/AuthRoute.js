const express = require("express");
const AuthController = require("../controllers/AuthController");
const upload = require("../config/multer");
const UserController = require("../controllers/UserController");
const AuthMiddleware = require("../middleware/Authmiddleware");


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

router.get("/courses", async (req, res) => {
  const { batch, type } = req.query; // Extract filters from query parameters
  try {
    const courses = await AuthController.getAllCourses(batch, type);
    res.status(200).json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});



// Route to fetch course details by ID
router.get("/courses/:courseId", AuthController.getCourseById);

// User profile route
router.get("/profile", AuthMiddleware(["student", "admin"]), UserController.getProfile);

// Update profile route
router.put("/editprofile", AuthMiddleware(["student", "admin"]), UserController.updateProfile);

// Update or remove profile picture
router.put(
  "/profile/picture",
  AuthMiddleware(["student", "admin"]),
  upload.single("image"), // Handle image upload
  UserController.updateProfilePicture
);



module.exports = router;
