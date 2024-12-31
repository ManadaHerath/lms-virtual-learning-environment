// controllers/SectionController.js
const Section = require('../models/SectionModel');

const SectionController = {
  getSectionsByCourse: async (req, res) => {
    const { courseId } = req.params;
    const {nic} = req.user; // Assuming `nic` is included in the token payload
  
    try {
      const result = await Section.getSectionsByCourseId(courseId, nic);
  
      if (result.error) {
        
        return res.status(403).json({ message: result.error });
      }
  
      const { enrollment_id, payment_status, sections } = result;
  
      // Group sections by week
      const weeks = sections.reduce((acc, section) => {
        const { week_id, ...rest } = section;
        if (!acc[week_id]) {
          acc[week_id] = { week_id, sections: [] };
        }
        acc[week_id].sections.push(rest);
        return acc;
      }, {});
  
      res.status(200).json({
        enrollment_id,
        payment_status,
        weeks: Object.values(weeks),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching sections." });
    }
  },
  
  createSection:async(req,res)=>{
    const courseId=req.body.courseId;
    const sectionData=req.body.sectionData;
    try {
      const id =await Section.createSectionByCourseId(courseId,sectionData);
      
      res.status(200).json({sectionId:id});
    } catch (error) {
      console.log(error)
      res.status(400);
    }
  }
};

module.exports = SectionController;
