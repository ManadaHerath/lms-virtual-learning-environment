import React, { useDebugValue, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api  from '../redux/api';
const CreateSection = () => {
    const [weekId,setWeekId]=useState();
    const [title,setTitle]=useState("");
    const [description,setDescription]=useState("")
    const [courseId,setCourseId]=useState()
    const [orderId,setOrderId]=useState();
    const [typeId,setTypeId]=useState();
    const [contentUrl,setContentUrl]=useState("")
    const [typeData, setTypeData] = useState({}); // State to store the dictionary


    useEffect(()=>{
        try {
            const res=api.get('/type');
            if (res.data.success) {
              // Convert array into a dictionary for quick access
              const dictionary = res.data.data.reduce((acc, item) => {
                  acc[item.type_id] = item.type;
                  return acc;
              }, {});
              setTypeData(dictionary); // Update state
              console.log(typeData);
          } else {
              console.error('Error fetching types:', res.data);
          }
        } catch (error) {
            
        }


    },[])

  return (


    <div>create_section</div>
  )
}

export default CreateSection