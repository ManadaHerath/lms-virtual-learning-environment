// routes/sectionRoutes.js
const express = require('express');
const SectionController = require('../controllers/SectionController');
const AuthMiddleware=require('../middleware/Authmiddleware');

const router = express.Router();

router.get('/:courseId/sections',AuthMiddleware(["student", "admin"]), SectionController.getSectionsByCourse);
// Update section status
router.patch("/:enrollmentId/section/:sectionId", SectionController.updateSectionStatus);
router.patch("/:enrollmentId/unenroll", SectionController.unenrollCourse);



module.exports = router;
