// routes/sectionRoutes.js
const express = require('express');
const SectionController = require('../controllers/SectionController');
const AuthMiddleware=require('../middleware/Authmiddleware');

const router = express.Router();

router.get('/:courseId/sections',AuthMiddleware(["student", "admin"]), SectionController.getSectionsByCourse);


module.exports = router;
