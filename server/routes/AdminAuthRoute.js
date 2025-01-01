const express = require("express");
const AdminController = require("../controllers/AdminController");
const AuthMiddleware = require("../middleware/Authmiddleware");
const upload = require("../config/multer");
const CourseController=require('../controllers/CourseController')
const router = express.Router();
const SectionController=require("../controllers/SectionController")


// Define rout es
router.post("/login", AdminController.adminLogin);
router.post("/signup",AuthMiddleware(["admin"]),AdminController.createAdmin);
router.post('/upload-course', upload.single('image'), (req, res, next) => {
    console.log('Upload course endpoint hit');
    console.log('Uploaded file details:', req.file);
    next(); // Pass control to AdminController.uploadCourse
}, CourseController.createCourse);
router.post('/upload-section',AuthMiddleware(["admin"]),SectionController.createSection);4
router.get('/course/:courseId/sections',AuthMiddleware(['admin']),SectionController.getSectionsForAdmin);
router.get('/course/:courseId/:weekId/maxorder',AuthMiddleware(['admin']),SectionController.getMaxOrderByCourseId);
router.post('/section',AuthMiddleware(['admin']),SectionController.createSection)

module.exports = router;
