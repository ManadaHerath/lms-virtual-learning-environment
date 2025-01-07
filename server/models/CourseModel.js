const pool = require("../config/dbconfig");

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
    updateCourseImage:async(course_id,image_url)=>{
      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();
        
       
        const query = `UPDATE Course SET image_url=? WHERE course_id=?`;
        const [result]=await connection.execute(query, [image_url,course_id]);
        
        await connection.commit();
        return result;
      } catch (error) {
        await connection.rollback();
        console.error('Error on Course image updated', error.message);
        throw error;
      } finally {
        await connection.release();
      }
    }
,
    updateCourse:async(courseData)=>{
        
 
      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();

        const formatDateForMySQL = (date) => {
      if (!(date instanceof Date)) {
        date = new Date(date); // Parse string or other values into a Date object
      }
      if (isNaN(date)) {
        throw new Error("Invalid date value provided");
      }
      return date.toISOString().slice(0, 19).replace("T", " ");
    };
    
        const startedAt = formatDateForMySQL(courseData.started_at);
        const endedAt = formatDateForMySQL(courseData.ended_at);
       
        const updateQuery = `
        UPDATE Course
        SET 
          course_type = ?, 
          batch = ?, 
          month = ?, 
          weeks = ?, 
          description = ?, 
          price = ?, 
          started_at = ?, 
          ended_at = ?
        WHERE course_id = ?
      `;
        const [result]=await connection.execute(updateQuery, [
          courseData.course_type,
          courseData.batch,
          courseData.month,
          courseData.weeks,
          
          courseData.description,
          courseData.price,
          
          
          startedAt,
          endedAt,
          courseData.course_id

          
        ]);
        
    
        
    
        await connection.commit();
        return result.insertId;
      } catch (error) {
        await connection.rollback();
        console.error('Error on Course updated', error.message);
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
    ,
    deleteCourseById:async(course_id)=>{
      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();
        
       
        const query = `
          delete from Course where course_id=?
        `;

        const [result]=await connection.execute(query, [course_id]);
        
    
        
    
        await connection.commit();
        return result;
      } catch (error) {
        await connection.rollback();
        console.error('Error on Coure deleting', error.message);
        throw error;
      } finally {
        await connection.release();
      }
    }
    



}
module.exports=CourseModel;