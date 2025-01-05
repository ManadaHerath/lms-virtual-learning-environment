// Frontend: React + Axios + Tailwind CSS
//add loading
import React, { useState } from 'react';
import axios from 'axios';
import api from '../redux/api';
const UploadCourse = () => {
  const [formData, setFormData] = useState({
    course_type: '',
    batch: '',
    month: '',
    weeks:'',
    description: '',
    price: '',
    
    
    started_at: '',
    ended_at: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const response = await api.post('/admin/upload-course', data);

      alert('Course uploaded successfully!');
     
    } catch (error) {
      console.error(error);
      alert('Error uploading course.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-50 shadow-lg rounded-lg">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">Upload Course</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="course_type"
          placeholder="Course Type (THEORY/REVISION/PAPER)"
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="batch"
          placeholder="Batch"
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="month"
          placeholder="Month"
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          name="weeks"
          placeholder="Weeks"
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
        <input
          type="number"
          name="price"
          placeholder="Price"
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
       
        <input
          type="date"
          name="started_at"
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="date"
          name="ended_at"
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Upload Course
        </button>
      </form>
    </div>
  );
};

export default UploadCourse;
