import React from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../redux/api'
import { useSnackbar } from "notistack";

const AdminEditCourse = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImageFile] = useState(null);
  const [error, setError] = useState(null);
  const [formValues, setFormValues] = useState({});

  // Helper: Format date for <input type="date" />
  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    return new Date(isoDate).toISOString().split("T")[0];
  };

  // Delete image
  const handleDeleteImage = async () => {
    try {
      const response = await api.put(`/admin/course/${courseId}/image`, { remove: true });
      if (!response.data.success) {
        throw new Error("Failed to delete image");
      } else {
        
        enqueueSnackbar("Image deleted successfully", { variant: "success" })
        window.location.reload();
      }
    } catch (error) {
      enqueueSnackbar("Image deletion unsuccessfully", { variant: "error" })
      console.error(error);
    }
  };

  // Upload image
  const handleImageUpload = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('image', image);
    if (image) {
      try {
        const response = await api.put(`/admin/course/${courseId}/image`, data);
        if (!response.data.success) {
          throw new Error("Failed to upload image");
        } else {
          enqueueSnackbar("Image uploaded successfully", { variant: "success" })
          
          window.location.reload();
        }
      } catch (error) {
        console.error(error);
        enqueueSnackbar("Image upload unsuccessfully", { variant: "error" })
      }
    } else {
      enqueueSnackbar("Please upload an image", { variant: "warning" })
      
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

        // Split the courseData.month into year and monthName
        const [year, monthName] = courseData.month.split(" ");
        setFormValues({
          ...courseData,
          year: year || "",
          monthName: monthName || "",
        });

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  // Handle all input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  // Update course
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // Reconstruct month in "YYYY MONTH" format
    const updatedFormValues = {
      ...formValues,
      month: `${formValues.year} ${formValues.monthName}`,
    };

    try {
      const response = await api.put(`/admin/course/${courseId}`, updatedFormValues);
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
      <div className="flex items-center justify-center h-full py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full py-10 text-red-400">
        <span className="mr-2">Error:</span> {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 mt-10 bg-gray-800/50 border border-gray-700/50 rounded-md">
      <h1 className="text-2xl font-semibold text-gray-200 mb-6">Edit Course</h1>

      {/* Go to course details */}
      <button
        className="flex items-center px-4 py-2 mb-6 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
        onClick={() => navigate(`/admin/course/${courseId}`)}
      >
        Course Details
      </button>

      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Batch */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Batch:</label>
          <input
            type="text"
            name="batch"
            value={formValues.batch || ""}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={`w-full bg-gray-800/50 border border-gray-700/50 text-gray-300 rounded-lg px-4 py-2 
              focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent 
              ${!isEditing ? "cursor-not-allowed" : ""}`}
          />
        </div>

        {/* Course Type */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Course Type:</label>
          <input
            type="text"
            name="course_type"
            value={formValues.course_type || ""}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={`w-full bg-gray-800/50 border border-gray-700/50 text-gray-300 rounded-lg px-4 py-2 
              focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent 
              ${!isEditing ? "cursor-not-allowed" : ""}`}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Description:</label>
          <textarea
            name="description"
            value={formValues.description || ""}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={`w-full bg-gray-800/50 border border-gray-700/50 text-gray-300 rounded-lg px-4 py-2 
              focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent 
              ${!isEditing ? "cursor-not-allowed" : ""}`}
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Price:</label>
          <input
            type="number"
            name="price"
            value={formValues.price || ""}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={`w-full bg-gray-800/50 border border-gray-700/50 text-gray-300 rounded-lg px-4 py-2 
              focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent 
              ${!isEditing ? "cursor-not-allowed" : ""}`}
          />
        </div>

        {/* Year */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Year:</label>
          <input
            type="text"
            name="year"
            value={formValues.year || ""}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={`w-full bg-gray-800/50 border border-gray-700/50 text-gray-300 rounded-lg px-4 py-2 
              focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent 
              ${!isEditing ? "cursor-not-allowed" : ""}`}
          />
        </div>

        {/* Month (as select) */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Month:</label>
          <select
            name="monthName"
            value={formValues.monthName || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`w-full bg-gray-800/50 border border-gray-700/50 text-gray-300 rounded-lg px-4 py-2 
              focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent 
              ${!isEditing ? "cursor-not-allowed" : ""}`}
          >
            <option value="JANUARY">JANUARY</option>
            <option value="FEBRUARY">FEBRUARY</option>
            <option value="MARCH">MARCH</option>
            <option value="APRIL">APRIL</option>
            <option value="MAY">MAY</option>
            <option value="JUNE">JUNE</option>
            <option value="JULY">JULY</option>
            <option value="AUGUST">AUGUST</option>
            <option value="SEPTEMBER">SEPTEMBER</option>
            <option value="OCTOBER">OCTOBER</option>
            <option value="NOVEMBER">NOVEMBER</option>
            <option value="DECEMBER">DECEMBER</option>
          </select>
        </div>

        {/* Weeks */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Weeks:</label>
          <select
            name="weeks"
            value={formValues.weeks || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`w-full bg-gray-800/50 border border-gray-700/50 text-gray-300 rounded-lg px-4 py-2 
              focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent 
              ${!isEditing ? "cursor-not-allowed" : ""}`}
          >
            <option value="" disabled>
              Select Weeks
            </option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Start Date:</label>
          <input
            type="date"
            name="started_at"
            value={formatDate(formValues.started_at) || ""}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={`w-full bg-gray-800/50 border border-gray-700/50 text-gray-300 rounded-lg px-4 py-2 
              focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent 
              ${!isEditing ? "cursor-not-allowed" : ""}`}
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">End Date:</label>
          <input
            type="date"
            name="ended_at"
            value={formatDate(formValues.ended_at) || ""}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={`w-full bg-gray-800/50 border border-gray-700/50 text-gray-300 rounded-lg px-4 py-2 
              focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent 
              ${!isEditing ? "cursor-not-allowed" : ""}`}
          />
        </div>

        {/* Image Section */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Image:</label>
          {formValues.image_url ? (
            <div className="flex items-center space-x-32">
              <img
                src={formValues.image_url}
                alt="Course"
                className="w-60 h-48  object-cover rounded-lg border border-gray-700/50"
              />
              <button
                type="button"
                onClick={handleDeleteImage}
                className="flex items-center  px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                Delete Photo
              </button>
            </div>
          ) : (
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full bg-gray-800/50 border border-gray-700/50 text-gray-300 rounded-lg px-4 py-2 
                  focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent"
              />
              <button
                className="flex items-center mt-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                onClick={handleImageUpload}
              >
                Upload
              </button>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-between h-14 mt-6">
          {isEditing ? (
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
            >
              Save Changes
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex items-center px-7 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
          >
            Edit
          </button>

          <button
            onClick={() => navigate(`/admin/course/${courseId}`)}
            className="flex items-center  px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditCourse;
