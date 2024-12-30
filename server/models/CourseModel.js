const pool = require("../config/dbconfig");
const CourseModel={
    createCourse:async(courseData)=>{
        
 
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
  
     
      const insertQuery = `
        INSERT INTO Course (course_type, batch, month,image_url, description,price,duration,progress,started_at,ended_at )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      await connection.execute(insertQuery, [
        courseData.course_type,
        courseData.batch,
        courseData.month,
        courseData.image_url,
        courseData.description,
        courseData.price,
        courseData.duration,
        courseData.progress,
        courseData.started_at,
        courseData.ended_at
        
      ]);
  
  
      
  
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      console.error('Transaction failed:', error.message);
      throw error;
    } finally {
      await connection.release();
    }


    }




}
module.exports=CourseModel;