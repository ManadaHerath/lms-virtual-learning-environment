// models/Section.js
const db = require('../config/dbconfig');
const pool=db
const Section = {

  getSectionsByCourseId: async (courseId, nic) => {
    const connection = await pool.getConnection();
    try {
      const userQuery = `
        SELECT e.enrollment_id, p.payment_status 
        FROM Enrollment e 
        LEFT JOIN Payment p ON e.enrollment_id = p.enrollment_id 
        WHERE e.course_id = ? AND e.nic = ?
      `;
      const [userResult] = await connection.execute(userQuery, [courseId, nic]);
  
      if (userResult.length === 0) {
        return { error: "User not enrolled in this course" };
      }
  
      const { enrollment_id, payment_status } = userResult[0];
  
      const sectionsQuery = payment_status === 'completed'
        ? `
            SELECT s.id, s.title, s.description, s.content_url, s.week_id, s.order_id 
            FROM Section s 
            WHERE s.course_id = ? 
            ORDER BY s.week_id, s.order_id
          `
        : `
            SELECT s.id, s.title, s.description, s.content_url, s.week_id, s.order_id 
            FROM Section s 
            WHERE s.course_id = ? AND s.week_id = 1
            ORDER BY s.order_id
          `;
  
      const [sections] = await connection.execute(sectionsQuery, [courseId]);
  
      return {
        enrollment_id,
        payment_status,
        sections,
      };
    } catch (error) {
      console.error('Error fetching sections:', error);
      throw error;
    } finally {
      connection.release();
    }

  },
  getSectionsForAdmin:async({courseId})=>{
   
    const connection = await pool.getConnection();
    const query=`SELECT s.id, s.title, s.description, s.content_url, s.week_id, s.order_id 
            FROM Section s 
            WHERE s.course_id = ? 
            ORDER BY s.week_id, s.order_id`
  
  try {
    const [sections]=await connection.execute(query,[courseId]);
    
    return {sections};
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }

}
  ,
  
  createSectionByCourseId:async (sectionData)=>{
    
        
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
  sectionData.courseId, // Updated to match the property name
  sectionData.weekId,   // Updated to match the property name
  sectionData.orderId,  // Updated to match the property name
  sectionData.typeId,   // Updated to match the property name
  sectionData.contentUrl
          
          
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
  },

  getMaxOrderByCourseId:async (courseId,weekId)=>{
    
   
      const connection = await pool.getConnection();
      const query=`select order_id from Section where course_id=? and week_id=? order by order_id desc limit 1;`
    
    try {
      const [maxOrder]=await connection.execute(query,[courseId,weekId]);
     
      return maxOrder;
    } catch (error) {
      throw error;
    } finally {
      connection.release();
    }
  },
  
  


  // models/sectionModel.js

 // Assuming you're using MySQL pool connection

// Function to update the status of the section
updateSectionStatus : async (enrollmentId, sectionId, markAsDone) => {
  const connection = await pool.getConnection();
  try {
    const query = `
      UPDATE UserSection 
      SET mark_as_done = ? 
      WHERE enrollment_id = ? AND section_id = ?
    `;
    const [result] = await connection.execute(query, [
      markAsDone ? 1 : 0, // Toggle between 0 and 1
      enrollmentId,
      sectionId,
    ]);
    return result;
  } catch (error) {
    console.error("Error updating section status:", error);
    throw error;
  } finally {
    connection.release();

  }
},

// Function to get the updated section status
getUpdatedSectionStatus : async (enrollmentId, sectionId) => {
  const connection = await pool.getConnection();
  try {
    const query = `
      SELECT * FROM UserSection 
      WHERE enrollment_id = ? AND section_id = ?
    `;
    const [updatedSection] = await connection.execute(query, [
      enrollmentId,
      sectionId,
    ]);
    return updatedSection;
  } catch (error) {
    console.error("Error fetching updated section status:", error);
    throw error;
  } finally {
    connection.release();
  }
},

unenrollCourseById: async (enrollmentId) => {
  const connection = await pool.getConnection();
  try {
    const unenrollQuery = `
      UPDATE Enrollment
      SET status = 'unenrolled'
      WHERE enrollment_id = ?
    `;

    const [result] = await connection.execute(unenrollQuery, [enrollmentId]);
    return result;
  } catch (error) {
    console.error("Error in unenrollCourseById:", error);
    throw error;
  } finally {
    connection.release();
  }
},


  
};

module.exports = Section;
