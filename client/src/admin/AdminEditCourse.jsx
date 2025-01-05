import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../redux/api";
import { Trash2, Edit, Save, XCircle, Upload } from "lucide-react";

const AdminEditCourse = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImageFile] = useState(null);
  const [error, setError] = useState(null);
  const [formValues, setFormValues] = useState({});

  // Delete image
  const handleDeleteImage = async () => {
    try {
      const response = await api.put(`/admin/course/${courseId}/image`, { remove: true });
      if (!response.data.success) {
        throw new Error("Failed to delete image");
      } else {
        alert("Image deleted successfully");
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Upload image
  const handleImageUpload = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("image", image);
    if (image) {
      try {
        const response = await api.put(`/admin/course/${courseId}/image`, data);
        if (!response.data.success) {
          throw new Error("Failed to upload image");
        } else {
          alert("Image uploaded successfully");
          window.location.reload();
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Please upload an image");
    }
  };

  // Fetch course details
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/admin/course/${courseId}`);
        if (!response.data.success) {
          throw new Error("Failed to fetch course");
        }
        const courseData = response.data.course;
        setCourseData(courseData);
        setFormValues(courseData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  // Update course
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/admin/course/${courseId}`, formValues);
      if (!response.data.success) {
        throw new Error("Failed to update course");
      }
      alert("Course updated successfully!");
      navigate(`/admin/editcourse/${courseId}`);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-400">
        <XCircle className="w-6 h-6 mr-2" />
        <span>Error: {error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold text-gray-200 mb-6 flex items-center">
        <Edit className="w-6 h-6 mr-2 text-blue-400" />
        Edit Course
      </h1>

      <button
        onClick={() => navigate(`/admin/course/${courseId}`)}
        className="flex items-center px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors mb-6"
      >
        Course Details
      </button>

      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Batch:</label>
          <input
            type="text"
            name="batch"
            value={formValues.batch || ""}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={`w-full bg-gray-800/50 border border-gray-700/50 text-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent ${
              !isEditing ? "cursor-not-allowed" : ""
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Course Type:</label>
          <input
            type="text"
            name="course_type"
            value={formValues.course_type || ""}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={`w-full bg-gray-800/50 border border-gray-700/50 text-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent ${
              !isEditing ? "cursor-not-allowed" : ""
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Description:</label>
          <textarea
            name="description"
            value={formValues.description || ""}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={`w-full bg-gray-800/50 border border-gray-700/50 text-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent ${
              !isEditing ? "cursor-not-allowed" : ""
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Price:</label>
          <input
            type="number"
            name="price"
            value={formValues.price || ""}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={`w-full bg-gray-800/50 border border-gray-700/50 text-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent ${
              !isEditing ? "cursor-not-allowed" : ""
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Month:</label>
          <input
            type="text"
            name="month"
            value={formValues.month || ""}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={`w-full bg-gray-800/50 border border-gray-700/50 text-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent ${
              !isEditing ? "cursor-not-allowed" : ""
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Weeks:</label>
          <input
            type="number"
            name="weeks"
            value={formValues.weeks || ""}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={`w-full bg-gray-800/50 border border-gray-700/50 text-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent ${
              !isEditing ? "cursor-not-allowed" : ""
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Start Date:</label>
          <input
            type="date"
            name="started_at"
            value={formValues.started_at || ""}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={`w-full bg-gray-800/50 border border-gray-700/50 text-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent ${
              !isEditing ? "cursor-not-allowed" : ""
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">End Date:</label>
          <input
            type="date"
            name="ended_at"
            value={formValues.ended_at || ""}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={`w-full bg-gray-800/50 border border-gray-700/50 text-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent ${
              !isEditing ? "cursor-not-allowed" : ""
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Image:</label>
          {formValues.image_url ? (
            <div className="flex items-center space-x-4">
              <img
                src={formValues.image_url}
                alt="Course"
                className="w-32 h-32 object-cover rounded-lg border border-gray-700/50"
              />
              <button
                type="button"
                onClick={handleDeleteImage}
                className="flex items-center px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Delete Photo
              </button>
            </div>
          ) : (
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full bg-gray-800/50 border border-gray-700/50 text-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent"
              />
              <button
                onClick={handleImageUpload}
                className="flex items-center mt-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-6">
          {isEditing ? (
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Changes
            </button>
          ) : (
            <div></div>
          )}

          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex items-center px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
          >
            <Edit className="w-5 h-5 mr-2" />
            Edit
          </button>

          <button
            onClick={() => navigate(`/admin/course/${courseId}`)}
            className="flex items-center px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <XCircle className="w-5 h-5 mr-2" />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditCourse;