import React, { useState } from 'react'
import api from '../redux/api';

const Registration = () => {
    const [nic,setNIC]=useState('')
    const [image,setImage]=useState(null);

    const handleSubmit=(e)=>{
        e.preventDefault();
        try {
            const data=new FormData();
            data.append('nic',nic);
            
            data.append('image',image);
            const result=api.post('/user/register',data);
            console.log(result);
        } catch (error) {
            console.error(error)
        }
    }

  return (
    <div>
        <div className="mb-4">
        <label className="block mb-1 font-medium">NIC Picture with Student</label>
        <input type="text" onChange={(e)=>{
            e.preventDefault()
            setNIC(e.target.value)
        }} className='px-5' placeholder='NIC' />
        </div>
        <div className="mb-4">
            <label className="block mb-1 font-medium">NIC Picture with Student</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={(e)=>{
                e.preventDefault()
                setImage(e.target.files[0])
              }}
              className="w-full px-5"
            />
          </div>
          <button onClick={handleSubmit}>Submit</button>
    </div>
  )
}

export default Registration