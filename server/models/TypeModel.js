const db = require('../config/dbconfig');

const TypeModel={
getTypeById:async (typeId)=>{
    const query='select getType(?)';
    try {
        const [result]=await db.query(query,[typeId]);
        const dynamicKey = Object.keys(result[0])[0];

      // Access the value of the dynamic key, which is an object
      const { data, success } = result[0][dynamicKey];

      return { data, success };
    
    } catch (error) {
        throw error
    }
},
getAllTypes:async ()=>{
    const query='select getAllTypes()';
    try {
        const [rows]=await db.query(query);
        const dynamicKey = Object.keys(rows[0])[0];
        const result = rows[0][dynamicKey];
        
        if (result.success) {
            return {
              success: true,
              data: result.data,
            };
          } else {
            return {
              success: false,
              message: result.data.message,
            };
          }
    } catch (error) {
        console.error('Error fetching types:', error);
    return {
      success: false,
      message: 'An error occurred while fetching types',
    };
    }
},
updateTypeById:async(typeId,type)=>{
  const query='update Type set type=? where type_id=?';
  try {
    console.log("dsd")
    db.query(query,[type,typeId]);
    return {success:true,message:"updated successfully type:"+typeId}
  } catch (error) {
    return {success:false,message:"updating unsuccessfull type:"+error}
  }
},

}
module.exports=TypeModel;