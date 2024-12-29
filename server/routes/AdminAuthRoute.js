const express = require("express");
const AdminController = require("../controllers/AdminController");
const AuthMiddleware = require("../middleware/Authmiddleware");
const upload = require("../config/multer");

const router = express.Router();

// Define rout es
router.post("/login", AdminController.adminLogin);
router.post("/signup",AuthMiddleware(["admin"]),AdminController.createAdmin);
router.post('/upload-course', upload.single('image'), (req, res, next) => {
    console.log('Upload course endpoint hit');
    console.log('Uploaded file details:', req.file);
    next(); // Pass control to AdminController.uploadCourse
}, AdminController.uploadCourse);

module.exports = router;
