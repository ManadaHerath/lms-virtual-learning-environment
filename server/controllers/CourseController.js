const CourseModel = require("../models/CourseModel");
const { deleteSectionById } = require("../models/SectionModel");
const UserModel = require("../models/UserModel");
const { getCourseById, getAllCourses } = require("./AuthController");
const { deleteSection } = require("./SectionController");

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

    },
    getCourseById:async(req,res)=>{
      try {
        const courseId=req.params;
        const course = await CourseModel.getCourseById(courseId);
        
        res.status(200).json({course:course[0] ,success:true});
      } catch (error) {
        res.status(500).json({ error: 'Internal server error'+error ,success:false});
      }
    },
    deleteCourseById:async(req,res)=>{
    try {
      const {courseId}=req.params;

      const result=await CourseModel.deleteCourseById(courseId);
      if(result.affectedRows===0){
        res.status(404).json({message:'Course not found',success:false});
      }else{
        res.status(200).json({message:'Course deleted successfully',success:true});
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' ,success:false});
    }
    }
    ,
    getAllCourses:async (req, res) => {
      const { batch, type } = req.query; // Extract filters from query parameters
      try {
        const courses = await UserModel.getAllCourses(batch, type);
        res.status(200).json(courses);
      } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to fetch courses" });
      }
    },
    userGetAllCourses:async (req, res) => {
      const { batch, type } = req.query; // Extract filters from query parameters
      try {
        const courses = await UserModel.userGetAllCourses(batch, type);
        res.status(200).json(courses);
      } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to fetch courses" });
      }
    }



}

module.exports=CourseController;