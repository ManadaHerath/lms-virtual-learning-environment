const CourseModel = require("../models/CourseModel");

const CourseController={
    createCourse:async(req,res)=>{
        try {
            const {
              course_type,
              batch,
              month,
              weeks,
              description,
              price,
              
              
              started_at,
              ended_at,
            } = req.body;
            const imageUrl = req.file.path;
      
            const courseId = await CourseModel.createCourse({
              course_type,
              batch,
              month,
              weeks,
              description,
              image_url: imageUrl,
              price,
              
              
              started_at,
              ended_at,
            });
      
            res.status(201).json({ message: 'Course uploaded successfully', courseId:courseId ,success:true });
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' ,success:false});
          }

    }


}

module.exports=CourseController;