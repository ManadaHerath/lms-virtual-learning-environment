const express = require("express");
const AuthController = require("../controllers/AuthController");
const upload = require("../config/multer");
const UserController = require("../controllers/UserController");
const QuizController = require("../controllers/QuizController");
const AuthMiddleware = require("../middleware/Authmiddleware");
const QuizEligibleMiddleware = require("../middleware/QuizEligibleMiddleware");
const RegistrationController = require("../controllers/RegistrationController");
const CourseController = require("../controllers/CourseController");


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
router.get("/logout", AuthMiddleware("student"), AuthController.logoutUser);

// Check authentication status
router.get("/check-auth", AuthMiddleware(["student"]), AuthController.checkAuth);

router.get("/courses",AuthMiddleware(['student','admin']) ,CourseController.userGetAllCourses);

// Route to fetch course details by ID
router.get("/courses/:courseId", AuthMiddleware(["student"]), AuthController.getCourseById);

// User profile route
router.get("/profile", AuthMiddleware(["student", "admin"]), UserController.getProfile);

// Update profile route
router.put("/editprofile", AuthMiddleware(["student", "admin"]), UserController.updateProfile);

// Get enrolled courses for the authenticated user
router.get("/enrolled", AuthMiddleware(["student", "admin"]), AuthController.getEnrolledCourses);
// Check whether paid to the course
router.get("/paid/:courseId", AuthMiddleware(["student"]), AuthController.checkPaid);


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
  "/quiz/:quizId/:courseId",
  AuthMiddleware(["student", "admin"]), // Both students and admins can view quiz details
  QuizEligibleMiddleware, // Check if the quiz is available
  QuizController.getQuizDetails
);

router.post(
  "/submit-quiz",
  AuthMiddleware(["student"]), // Only students can submit quizzes
  QuizController.submitQuiz
);

// Quiz review for students
router.get(
  "/quiz/:quizId/review/:courseId",
  AuthMiddleware(["student"]), // Only students can access quiz reviews
  QuizEligibleMiddleware,
  QuizController.getQuizReview
);

router.get(
  "/quiz/:quizId/info/:courseId",
  AuthMiddleware(["student", "admin"]), // Accessible to both students and admins
  QuizEligibleMiddleware,
  QuizController.getQuizInfoById
);

router.post("/register", AuthMiddleware(["student", "admin"]),upload.single("image"), RegistrationController.uploadImage);
router.put("/register", AuthMiddleware(["student", "admin"]),upload.single("image"), RegistrationController.updateImage);
router.get('/register', AuthMiddleware(["admin",'student']), RegistrationController.getImageByNIC);



module.exports = router;
