const pool = require("../config/dbconfig");
const { getCourseById } = require("./UserModel");
const CourseModel={
    createCourse:async(courseData)=>{
        
 
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
  
     
      const insertQuery = `
        INSERT INTO Course (course_type, batch, month,weeks,image_url, description,price,started_at,ended_at )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const [result]=await connection.execute(insertQuery, [
        courseData.course_type,
        courseData.batch,
        courseData.month,
        courseData.weeks,
        courseData.image_url,
        courseData.description,
        courseData.price,
        
        
        courseData.started_at,
        courseData.ended_at
        
      ]);
      
  
      
  
      await connection.commit();
      return result.insertId;
    } catch (error) {
      await connection.rollback();
      console.error('Error on Course added', error.message);
      throw error;
    } finally {
      await connection.release();
    }


    },
    getCourseById:async(courseId)=>{
      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();
        
       
        const query = `
          select * from Course where course_id=?
        `;

        const [result]=await connection.execute(query, [courseId.courseId]);
        
    
        
    
        await connection.commit();
        return result;
      } catch (error) {
        await connection.rollback();
        console.error('Error on Course fetching', error.message);
        throw error;
      } finally {
        await connection.release();
      }
    }




}
module.exports=CourseModel;