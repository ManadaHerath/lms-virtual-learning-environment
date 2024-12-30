const CourseModel = require("../models/CourseModel");

const CourseController={
    createCourse:async(req,res)=>{
        try {
            const {
              course_type,
              batch,
              month,
              description,
              price,
              duration,
              progress,
              started_at,
              ended_at,
            } = req.body;
            const imageUrl = req.file.path;
      
            const courseId = await CourseModel.createCourse({
              course_type,
              batch,
              month,
              description,
              image_url: imageUrl,
              price,
              duration,
              progress,
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