// models/Section.js
const db = require('../config/dbconfig');
const pool=db
const Section = {
  getSectionsByCourseId: async (courseId) => {
    const query = `
      SELECT 
        s.id, s.title, s.description, s.content_url,  
        s.week_id, s.order_id 
      FROM Section s 
      WHERE s.course_id = ?
      ORDER BY s.week_id, s.order_id
    `;
    const [rows] = await db.execute(query, [courseId]);
    return rows;
  },
  createSectionByCourseId:async (course_id,sectionData)=>{
    
        
 
      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();
    
       
        const insertQuery = `
          INSERT INTO Section (title, description, course_id,week_id, order_id,type_id,content_url )
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const [result]=await connection.execute(insertQuery, [
          sectionData.title,
          sectionData.description,
          sectionData.course_id,
          sectionData.week_id,
          sectionData.order_id,
          sectionData.type_id,
          sectionData.content_url
          
          
        ]);
        
    
        
    
        await connection.commit();
        
        return result.insertId;
      } catch (error) {
        await connection.rollback();
        console.error('Error on Section added', error.message);
        throw error;
      } finally {
        await connection.release();
      }
  }
};

module.exports = Section;
