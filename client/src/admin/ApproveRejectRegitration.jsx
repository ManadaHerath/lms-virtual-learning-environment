import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { deactivateStudentStatus } from '../features/students/StudentSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import api from '../redux/api';
const ApproveRejectRegitration = () => {
    const dispatch = useDispatch();
    const nic=useParams().nic;
    const [image_url,setImageUrl]=useState('');
    const navigate=useNavigate();
    const handleStatus = (status) => {
       
        dispatch(deactivateStudentStatus({ id:nic,status })).unwrap() // Waits for the action to complete
        .then(() => {
            alert('successfully updated status of student : '+nic+' to '+status);
            navigate('/admin/student');
        })
          .catch((error) => {
            console.error("Error toggling status:"+status, error);
          });
      };
      useEffect(() => {
        const getImage=async()=>{
            try {
                const res=await api.get(`/admin/register/${nic}`);
                
                setImageUrl(res.data.image_url);
            } catch (error) {
                console.error("Error getting image", error);
            }
        }

        getImage();



      }, [nic])
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Approve/Reject Registration</h1>
      {image_url ? (
        <div className="flex flex-col items-center">
          <img
            src={image_url}
            alt="Uploaded by user"
            className="w-64 h-64 object-cover rounded-lg shadow-md"
          />
          <div className="mt-4 space-x-4">
            <button
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              onClick={() => handleStatus('ACTIVE')}
            >
              Approve
            </button>
            <button
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              onClick={() => handleStatus('INACTIVE')}
            >
              Reject
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Loading image...</p>
      )}
    </div>
  )
}

export default ApproveRejectRegitration