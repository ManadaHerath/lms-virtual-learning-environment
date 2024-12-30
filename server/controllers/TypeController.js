const TypeModel=require("../models/TypeModel");
const TypeController={
    getAlltypes:async(req,res)=>{
        try {
            const result=await TypeModel.getAllTypes();
           
                res.status(200).send({result:result})
            
        } catch (error) {
            res.status(500).json({message:"internal server error "+error})
        }
    },
    getTypeById:async(req,res)=>{
        const { typeId } = req.params;
        try {
            const result=await TypeModel.getTypeById(typeId);
            res.status(200).send({result:result})
        } catch (error) {
            res.status(500).json({message:"internal server error on type"})
        }
    },
    updateTypeById:async(req,res)=>{
        const { typeId, type } = req.body;
        
        try {
            const result=await TypeModel.updateTypeById(typeId,type);
            console.log(result);
            res.status(200).send({result:result})
        } catch (error) {
            res.status(500).json({messsage:"internal server error on types"+error});

            
        }
    }
}
module.exports=TypeController