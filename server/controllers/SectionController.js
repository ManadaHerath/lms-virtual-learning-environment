// controllers/SectionController.js
const Section = require('../models/SectionModel');

const SectionController = {
  getSectionsByCourse: async (req, res) => {
    const { courseId } = req.params;
    const { nic } = req.user; // Assuming nic is included in the token payload

    try {
        // Fetch sections, enrollment details, payment status, and course price
        const result = await Section.getSectionsByCourseId(courseId, nic);

        if (result.error) {
            return res.status(500).json({ message: result.error });
        }

        const { enrollment_id, paymentType, sections, price } = result;

        // Group sections by week and apply locked state based on payment type
        const weeks = sections.reduce((acc, section) => {
            const { week_id, ...rest } = section;
            if (!acc[week_id]) {
                acc[week_id] = { week_id, sections: [] };
            }

            // Lock YouTube videos if payment type is 'physical'
            const isYouTube = rest.content_url && rest.content_url.includes("youtube.com");
            const locked = paymentType === "physical" && isYouTube;

            acc[week_id].sections.push({ ...rest, locked });
            return acc;
        }, {});

        // Send response with enrollment details, payment status, course price, and sections grouped by weeks
        res.status(200).json({
            enrollment_id,
            paymentType,
            price,
            weeks: Object.values(weeks),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching sections." });
    }
},

  getSectionsForAdmin:async  (req,res)=>{
    const courseId=req.params;
    
    try {

      const result = await Section.getSectionsForAdmin(courseId);
  
      if (result.error) {
        
        return res.status(500).json({ message: result.error });
      }
  
      const {sections } = result;
  
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
        weeks: Object.values(weeks),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching sections." });
    }
  }
  ,
  
  createSection:async(req,res)=>{
    
    const sectionData=req.body.sectionData;
    try {
      const id =await Section.createSectionByCourseId(sectionData);
      
      res.status(200).json({sectionId:id});
    } catch (error) {
      console.log(error)
      res.status(400);
    }
  },
  deleteSection:async(req,res)=>{
    const {sectionId}=req.params;
    try {
      const result=await Section.deleteSectionById(sectionId);
      if(result.affectedRows===0){
        res.status(404).json({success:false ,message:"Section not found"})
      }
      else{
        res.status(200).json({success:true ,message:"Section deleted successfully"})
      }
      
    } catch (error) {
      console.log(error)
      res.status(400).json({success:false ,message:"Failed to delete section"})
  }
}
  ,

  



  // Section update logic
// controllers/sectionController.js

// Function to update the section status and return the updated value
updateSectionStatus : async (req, res) => {
  const { enrollmentId, sectionId } = req.params;
  const { mark_as_done } = req.body;

  try {
    // Update section status in the UserSection table
    const result = await Section.updateSectionStatus(enrollmentId, sectionId, mark_as_done);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Section not found or not updated" });
    }

    // Fetch the updated section from UserSection to return the new status
    const updatedSection = await Section.getUpdatedSectionStatus(enrollmentId, sectionId);
    
    res.status(200).json({
      message: "Section updated successfully",
      updatedSection: updatedSection[0], // Return the updated section with mark_as_done
    });
  } catch (error) {
    console.error("Error updating section status:", error);
    res.status(500).json({ message: "Failed to update section status" });

  }
},
  getMaxOrderByCourseId:async(req,res)=>{
    const {courseId,weekId}=req.params;
    try {
      const maxOrder=await Section.getMaxOrderByCourseId(courseId,weekId);
      if(!maxOrder){
        res.status(200).json({maxOrder:maxOrder[0].order_id,success:true})
      }
      else{
        res.status(200).json({maxOrder:0,success:true})
      }
    } catch (error) {
      console.log(error)
      res.status(400).json({success:false})
    }
  },

unenrollCourse: async (req, res) => {
  const { enrollmentId } = req.params;

  try {
    const result = await Section.unenrollCourseById(enrollmentId);

    if (result.affectedRows === 0) {
      return res.status(404).json({success:false ,message: "Enrollment not found" });
    }

    res.status(200).json({success:true , message: "Successfully unenrolled from course" });
  } catch (error) {
    console.error("Error unenrolling:", error);
    res.status(500).json({success:false , message: "Error unenrolling from course" });
  }
},



};

module.exports = SectionController;
