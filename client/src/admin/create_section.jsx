import React, { useDebugValue, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../../server/config/cloudinary';
const create_section = () => {
    const [weekId,setWeekId]=useState();
    const [title,setTitle]=useState("");
    const [description,setDescription]=useState("")
    const [courseId,setCourseId]=useState()
    const [orderId,setOrderId]=useState();
    const [typeId,setTypeId]=useState();
    const [contentUrl,setContentUrl]=useState("")

    useEffect(()=>{
        try {
            const res=api.get('/type');
            console.log(res);
        } catch (error) {
            
        }


    },[])

  return (


    <div>create_section</div>
  )
}

export default create_section