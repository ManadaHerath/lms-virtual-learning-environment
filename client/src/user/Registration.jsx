import React, { useState, useEffect } from 'react';
import api from '../redux/api';
import { useNavigate, useParams } from 'react-router-dom';

const Registration = () => {
  
  const [image, setImage] = useState(null);
  const navigate=useNavigate();
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the existing image if it exists
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await api.get(`/user/register`);
        if (res.data.image_url ) {
          setExistingImageUrl(res.data.image_url );
        }
        setLoading(false);
      } catch (error) {
        
        console.error('Error fetching image:');
        setLoading(false);
      }
    };

    fetchImage();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(image){
      try {
        const data = new FormData();
        
        data.append('image', image);
  
        if (existingImageUrl) {
          // Update the existing image
          const result = await api.put('/user/register', data);
          console.log('Image updated:', result);
        } else {
          // Upload a new image
          const result = await api.post('/user/register', data);
          console.log('Image uploaded:', result);
        }
      } catch (error) {
        console.error('Error submitting image:', error);
      }
    }else{
      alert("Please select an image to upload")
    }
    
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Registration</h1>

      {existingImageUrl ? (
        <div>
          <h2 className="text-lg font-medium mb-2">Update Image</h2>
          <div className="mb-4">
            <img
              src={existingImageUrl}
              alt="Existing"
              className="w-64 h-64 object-cover rounded-lg shadow-md mb-4"
            />
            <label className="block mb-1 font-medium">Upload a New Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full px-5"
            />
          </div>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Update Image
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-medium mb-2">Upload Image</h2>
          <div className="mb-4">
            <label className="block mb-1 font-medium">NIC Picture with Student</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full px-5"
            />
          </div>
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            Upload Image
          </button>
        </div>
      )}
    </div>
  );
};

export default Registration;
