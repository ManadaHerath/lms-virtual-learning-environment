// controllers/SectionController.js
const Section = require('../models/SectionModel');

const SectionController = {
  getSectionsByCourse: async (req, res) => {
    const { courseId } = req.params;
    try {
      const sections = await Section.getSectionsByCourseId(courseId);

      // Group sections by week
      const weeks = sections.reduce((acc, section) => {
        const { week_id, ...rest } = section;
        if (!acc[week_id]) {
          acc[week_id] = { week_id, sections: [] };
        }
        acc[week_id].sections.push(rest);
        return acc;
      }, {});

      res.status(200).json(Object.values(weeks));
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching sections.' });
    }
  },
};

module.exports = SectionController;
