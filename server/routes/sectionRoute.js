// routes/sectionRoutes.js
const express = require('express');
const SectionController = require('../controllers/SectionController');

const router = express.Router();

router.get('/:courseId/sections', SectionController.getSectionsByCourse);

module.exports = router;
