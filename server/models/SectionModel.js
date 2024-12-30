// models/Section.js
const db = require('../config/dbconfig');

const Section = {
  getSectionsByCourseId: async (courseId) => {
    const query = `
      SELECT 
        s.id, s.title, s.description, s.content_url, s.mark_as_done, 
        s.week_id, s.order_id 
      FROM Section s 
      WHERE s.course_id = ?
      ORDER BY s.week_id, s.order_id
    `;
    const [rows] = await db.execute(query, [courseId]);
    return rows;
  },
};

module.exports = Section;
