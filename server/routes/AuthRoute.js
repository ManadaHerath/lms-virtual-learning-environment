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

// Get enrolled courses for the authenticated user
router.get("/enrolled", AuthMiddleware(["student", "admin"]), AuthController.getEnrolledCourses);


// Update or remove profile picture
router.put(
  "/profile/picture",
  AuthMiddleware(["student", "admin"]),
  upload.single("image"), // Handle image upload
  UserController.updateProfilePicture
);


// Enroll in a course
router.post("/enroll/:courseId", AuthMiddleware(["student", "admin"]), (req, res, next) => {
  // Log the incoming request details for the /enroll/:courseId route
  console.log(`Incoming request to enroll in course with ID: ${req.params.courseId}`);
  console.log(`Request body:`, req.body);
  
  
  // Call the next handler (which will be the AuthController.enrollCourse)
  next();
}, AuthController.enrollCourse);

// Get payment history
router.get("/payments", AuthMiddleware(["student", "admin"]), UserController.getPaymentHistory);


module.exports = router;
