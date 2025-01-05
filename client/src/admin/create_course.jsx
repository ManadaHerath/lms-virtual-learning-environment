import React, { useState } from 'react';
import { Upload, Calendar, Book, DollarSign, Clock, FileText, Image as ImageIcon } from 'lucide-react';
import api from '../redux/api';

const UploadCourse = () => {
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-200 flex items-center">
          <Upload className="w-6 h-6 mr-2 text-blue-400" />
          Upload New Course
        </h1>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Course Type</label>
                <select
                  name="course_type"
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent"
                >
                  <option value="">Select Type</option>
                  <option value="THEORY">Theory</option>
                  <option value="REVISION">Revision</option>
                  <option value="PAPER">Paper</option>
                </select>
              </div>

              <InputField
                type="text"
                name="batch"
                placeholder="Batch Number"
                onChange={handleChange}
                required
                icon={Book}
              />

              <InputField
                type="text"
                name="month"
                placeholder="Month"
                onChange={handleChange}
                required
                icon={Calendar}
              />

              <InputField
                type="number"
                name="weeks"
                placeholder="Number of Weeks"
                onChange={handleChange}
                required
                icon={Clock}
              />
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Course Description</label>
                <textarea
                  name="description"
                  placeholder="Enter course description..."
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/50 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent resize-none h-32"
                />
              </div>

              <InputField
                type="number"
                name="price"
                placeholder="Course Price"
                onChange={handleChange}
                required
                icon={DollarSign}
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Start Date</label>
                  <InputField
                    type="date"
                    name="started_at"
                    onChange={handleChange}
                    required
                    icon={Calendar}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">End Date</label>
                  <InputField
                    type="date"
                    name="ended_at"
                    onChange={handleChange}
                    required
                    icon={Calendar}
                  />
                </div>
              </div>
            </div>
          </div>

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
          </div>

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