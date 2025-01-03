const express = require("express");
const AuthController = require("../controllers/AuthController");
const upload = require("../config/multer");
const UserController = require("../controllers/UserController");
const QuizController = require("../controllers/QuizController");
const AuthMiddleware = require("../middleware/Authmiddleware");
const RegistrationController = require("../controllers/RegistrationController");


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

// Check authentication status
router.get("/check-auth", AuthMiddleware("student"), AuthController.checkAuth);

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


// Routes for quizzes
// Student routes
router.get(
  "/quiz/:quizId",
  AuthMiddleware(["student", "admin"]), // Both students and admins can view quiz details
  QuizController.getQuizDetails
);

router.post(
  "/submit-quiz",
  AuthMiddleware(["student"]), // Only students can submit quizzes
  QuizController.submitQuiz
);

// Quiz review for students
router.get(
  "/quiz/:quizId/review",
  AuthMiddleware(["student"]), // Only students can access quiz reviews
  QuizController.getQuizReview
);

router.get(
  "/quiz/:quizId/info",
  AuthMiddleware(["student", "admin"]), // Accessible to both students and admins
  QuizController.getQuizInfoById
);

router.post("/register", AuthMiddleware(["student", "admin"]),upload.single("image"), RegistrationController.uploadImage);



module.exports = router;
