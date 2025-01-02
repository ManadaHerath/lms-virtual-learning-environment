const express = require("express");
const AdminController = require("../controllers/AdminController");
const AuthMiddleware = require("../middleware/Authmiddleware");
const upload = require("../config/multer");
const CourseController=require('../controllers/CourseController')
const router = express.Router();
const SectionController=require("../controllers/SectionController")
const QuizController = require("../controllers/QuizController");
const multer = require("multer");

// Multer setup for handling image uploads
const storage = multer.memoryStorage();
const Upload = multer({ storage });


// Define rout es
// Admin Authentication Routes
router.post("/login", AdminController.adminLogin);
router.post("/signup",AuthMiddleware(["admin"]),AdminController.createAdmin);
router.post("/logout", AuthMiddleware(["admin"]), AdminController.adminLogout);
router.get("/check-auth", AuthMiddleware(["admin"]), AdminController.checkAuth);

//course management
router.post('/upload-course',AuthMiddleware(['admin']) ,upload.single('image'), (req, res, next) => {
    console.log('Upload course endpoint hit');
    console.log('Uploaded file details:', req.file);
    next(); // Pass control to AdminController.uploadCourse
}, CourseController.createCourse);
router.post('/upload-section',AuthMiddleware(["admin"]),SectionController.createSection);4
router.get('/course/:courseId/sections',AuthMiddleware(['admin']),SectionController.getSectionsForAdmin);
router.get('/course/:courseId/:weekId/maxorder',AuthMiddleware(['admin']),SectionController.getMaxOrderByCourseId);
router.post('/section',AuthMiddleware(['admin']),SectionController.createSection)
router.get('/course/:courseId',AuthMiddleware(['admin']),CourseController.getCourseById);


// Student Management Routes
// Get all students
router.get('/students', AuthMiddleware(["admin"]), AdminController.getStudents);
// Get student by ID
router.get('/students/:id', AuthMiddleware(["admin"]), AdminController.getStudentById);
// Update student status by ID
router.patch('/students/:id', AuthMiddleware(["admin"]), AdminController.updateStudentStatus);

router.post(
  "/admin/create-quiz",
  AuthMiddleware(["admin"]),
  Upload.array("images"), // Accept multiple images for questions
  QuizController.createQuiz
);

module.exports = router;
