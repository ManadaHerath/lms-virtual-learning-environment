const express = require("express");
const AdminController = require("../controllers/AdminController");
const AuthMiddleware = require("../middleware/Authmiddleware");
const upload = require("../config/multer");
const CourseController = require('../controllers/CourseController')
const router = express.Router();
const SectionController = require("../controllers/SectionController")
const QuizController = require("../controllers/QuizController");
const RegistrationController = require("../controllers/RegistrationController");
const UserController = require("../controllers/UserController");


// Define rout es
// Admin Authentication Routes
router.post("/login", AdminController.adminLogin);
router.post("/signup", AuthMiddleware(["admin"]), AdminController.createAdmin);
router.post("/logout", AuthMiddleware(["admin"]), AdminController.adminLogout);
router.get("/check-auth", AuthMiddleware(["admin"]), AdminController.checkAuth);

//course management
router.post('/upload-course', AuthMiddleware(['admin']), upload.single('image'), (req, res, next) => {
  
  
  next(); // Pass control to AdminController.uploadCourse
}, CourseController.createCourse);

router.post('/upload-section', AuthMiddleware(["admin"]), SectionController.createSection);
router.get('/course/:courseId/sections', AuthMiddleware(['admin']), SectionController.getSectionsForAdmin);
router.get('/course/:courseId/:weekId/maxorder', AuthMiddleware(['admin']), SectionController.getMaxOrderByCourseId);
router.post('/section', AuthMiddleware(['admin']), SectionController.createSection)
router.delete('/section/:sectionId', AuthMiddleware(['admin']), SectionController.deleteSection);

//coursess
router.get('/course/:courseId', AuthMiddleware(['admin']), CourseController.getCourseById);
router.delete('/course/:courseId', AuthMiddleware(['admin']), CourseController.deleteCourseById);
router.put('/course/:courseId', AuthMiddleware(['admin']), CourseController.updateCourse);
router.put('/course/:courseId/image', AuthMiddleware(['admin']), upload.single('image'), CourseController.updateCourseImage);
router.get("/courses",AuthMiddleware(['admin']) ,CourseController.getAllCourses);



// Student Management Routes
// Get all students
router.get('/students', AuthMiddleware(["admin"]), AdminController.getStudents);
// Get student by ID
router.get('/students/:id', AuthMiddleware(["admin"]), AdminController.getStudentById);
// Update student status by ID
router.patch('/students', AuthMiddleware(["admin"]), AdminController.updateStudentStatus);
//delete student by ID
router.delete('/students', AuthMiddleware(["admin"]), UserController.deleteUser);
// Get enrolled students by course ID
router.get('/studentsby/:courseId', AuthMiddleware(["admin", "student"]), AdminController.getEnrolledStudents);
// Physical payment
router.post('/student/payment', AuthMiddleware(["admin"]), AdminController.addPayment);


//Registration Management
router.get('/register/:nic', AuthMiddleware(["admin"]), RegistrationController.adminGetImageByNIC);

// Admin routes
router.post(
  "/create-quiz",
  AuthMiddleware(["admin"]), // Only admins can create quizzes
  QuizController.createQuiz
);
module.exports = router;
