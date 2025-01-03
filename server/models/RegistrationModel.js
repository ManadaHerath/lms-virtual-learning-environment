const db = require('../config/dbconfig');

const RegistrationModel={
getImageByNIC:async (nic)=>{
    const query='select image_url from Registration where nic=?';
    try {
        const [result]=await db.query(query,[nic]);
      

      // Access the value of the dynamic key, which is an object
      

      return result;
    
    } catch (error) {
        throw error
    }
},
uploadImage:async (nic,image_url)=>{
  const query='insert into Registration(nic,image_url) value(?,?)';

  try {
    const [result]=await db.query(query,[nic,image_url]);
    return result;
  } catch (error) {
    throw error;
  }
},

}
module.exports=RegistrationModel;