import React, { useState } from 'react';
import { Upload, Calendar, Book, DollarSign, Clock, Image as ImageIcon } from 'lucide-react';
import api from '../redux/api';

const UploadCourse = () => {
  // State to manage form data
  const [formData, setFormData] = useState({
    course_type: '',
    batch: '',
    month: '',
    weeks: '',
    description: '',
    price: '',
    started_at: '',
    ended_at: '',
    image: null,
  });

  // State to manage image preview
  const [imagePreview, setImagePreview] = useState(null);

  // Handle changes for text, select, number, date inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle changes for file inputs and set image preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });

    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  // Function to format month from "YYYY-MM" to "YYYY MONTH"
  const formatMonth = (monthValue) => {
    if (!monthValue) return '';
    const [year, month] = monthValue.split("-");
    const monthName = new Date(year, month - 1).toLocaleString("en-US", { month: "long" }).toUpperCase();
    return `${year} ${monthName}`; // e.g., "2024 JULY"
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    // Format 'month' field
    const formattedMonth = formatMonth(formData.month);

    for (const key in formData) {
      if (key === 'month') {
        data.append(key, formattedMonth);
      } else {
        data.append(key, formData[key]);
      }
    }

    try {
      const response = await api.post('/admin/upload-course', data);
      alert('Course uploaded successfully!');
      // Optionally, reset the form
      setFormData({
        course_type: '',
        batch: '',
        month: '',
        weeks: '',
        description: '',
        price: '',
        started_at: '',
        ended_at: '',
        image: null,
      });
      setImagePreview(null); // Reset image preview
    } catch (error) {
      console.error(error);
      alert('Error uploading course.');
    }
  };

  // Reusable InputField component
  const InputField = ({ icon: Icon, ...props }) => (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-500" />
      </div>
      <input
        {...props}
        className="w-full pl-10 px-4 py-2 bg-gray-800/50 border border-gray-700/50 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent placeholder-gray-500"
      />
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-200 flex items-center">
          <Upload className="w-6 h-6 mr-2 text-blue-400" />
          Upload New Course
        </h1>
      </div>

      {/* Form Container */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Grid Layout for Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Course Type */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Course Type</label>
                <select
                  name="course_type"
                  onChange={handleChange}
                  required
                  value={formData.course_type}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent"
                >
                  <option value="">Select Type</option>
                  <option value="THEORY">Theory</option>
                  <option value="REVISION">Revision</option>
                  <option value="PAPER">Paper</option>
                </select>
              </div>

              {/* Batch Number */}

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Book className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  name="batch"
                  placeholder="Batch Number"
                  onChange={handleChange}
                  value={formData.batch}
                  required
                  className="w-full pl-10 px-4 py-2 bg-gray-800/50 border border-gray-700/50 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent placeholder-gray-500"
                />
              </div>


              {/* Month (Year and Month) */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="month"
                  name="month"
                  placeholder="Year and Month"
                  onChange={handleChange}
                  value={formData.month}
                  required
                  className="w-full pl-10 px-4 py-2 bg-gray-800/50 border border-gray-700/50 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent placeholder-gray-500"
                />
              </div>

           

              {/* Number of Weeks */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="number"
                  name="weeks"
                  placeholder="Number of Weeks"
                  onChange={handleChange}
                  value={formData.weeks}
                  required
                  className="w-full pl-10 px-4 py-2 bg-gray-800/50 border border-gray-700/50 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent placeholder-gray-500"
                />
              </div>

             
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Course Description */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Course Description</label>
                <textarea
                  name="description"
                  placeholder="Enter course description..."
                  onChange={handleChange}
                  required
                  value={formData.description}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent resize-none h-32"
                />
              </div>

              {/* Course Price */}

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="number"
                  name="price"
                  placeholder="Course Price"
                  onChange={handleChange}
                  value={formData.price}
                  required
                  className="w-full pl-10 px-4 py-2 bg-gray-800/50 border border-gray-700/50 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent placeholder-gray-500"
                />
              </div>
              

              {/* Start and End Dates */}
              <div className="grid grid-cols-2 gap-4">
                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Start Date</label>
                  <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="date"
                  name="started_at"
                
                  onChange={handleChange}
                  value={formData.started_at}
                  required
                  className="w-full pl-10 px-4 py-2 bg-gray-800/50 border border-gray-700/50 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent placeholder-gray-500"
                />
              </div>
                  
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">End Date</label>
                  <InputField
                    type="date"
                    name="ended_at"
                    onChange={handleChange}
                    required
                    value={formData.ended_at}
                    icon={Calendar}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Course Image Upload */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-400">Course Image</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col w-full h-32 border-2 border-gray-700/50 border-dashed rounded-lg cursor-pointer hover:bg-gray-700/20 transition-colors">
                <div className="flex flex-col items-center justify-center pt-7">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                  <p className="pt-1 text-sm tracking-wider text-gray-400">
                    Upload course image
                  </p>
                </div>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  required
                  className="opacity-0"
                />
              </label>
            </div>
            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-4 flex justify-center">
                <img src={imagePreview} alt="Course Preview" className="max-h-40 rounded-lg shadow-md" />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload Course
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadCourse;
