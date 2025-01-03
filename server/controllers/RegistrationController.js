
const RegistrationModel=require('../models/RegistrationModel');

const RegistrationController={
    getImageByNIC:async(req,res)=>{
        const { nic } = req.user;
        try {
            const result=await RegistrationModel.getImageByNIC(nic);
            
            res.status(200).send({image_url:result[0].image_url,success:true})
        } catch (error) {
            res.status(500).json({message:"internal server error "+error,success:false})
        }
    },
    adminGetImageByNIC:async(req,res)=>{
        const { nic } = req.body;
        try {
            const result=await RegistrationModel.getImageByNIC(nic);
            
            res.status(200).send({image_url:result[0].image_url,success:true})
        } catch (error) {
            res.status(500).json({message:"internal server error "+error,success:false})
        }
    },
    
    uploadImage:async(req,res)=>{
        const { nic } = req.user;
        
        const image_url = req.file ? req.file.path : null;
        
        try {
            const result=await RegistrationModel.uploadImage(nic,image_url);
            
            res.status(200).send({result:result, success:true})
        } catch (error) {
            res.status(500).json({message:"internal server error "+error,success:false})
        }
    },
    updateImage:async(req,res)=>{
        const { nic } = req.user;
        
        const image_url = req.file ? req.file.path : null;
        try {
            const result=await RegistrationModel.updateImage(nic,image_url);
            
            res.status(200).send({result:result, success:true})
        } catch (error) {
            res.status(500).json({message:"internal server error "+error,success:false})
        }
    }

}
module.exports=RegistrationController;