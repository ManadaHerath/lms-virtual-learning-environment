import React from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../redux/api'
const AdminEditCourse = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImageFile] = useState(null);
  const [error, setError] = useState(null);
  const [formValues, setFormValues] = useState({});
  //delete image
  const formatDate = (isoDate) => {
    if (!isoDate) return ""; // Handle empty values
    return new Date(isoDate).toISOString().split("T")[0]; // Extract only the date
  };
  
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
  //upload image
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

  //fetch course details
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/admin/course/${courseId}`);

        if (!response.data.success) {
          throw new Error("Failed to fetch course");
        }

        const courseData = response.data.course;
        setCourseData(courseData);

        // Split month into year and monthName
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


  // Fetch sections for the course
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  //update course
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
  

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Course</h1>
      <button className='p-2 bg-blue-400' onClick={() => { navigate(`/admin/course/${courseId}`); }}> Coure Details</button>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium">Batch:</label>
          <input
            type="text"
            name="batch"
            value={formValues.batch || ""}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={`w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${!isEditing ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Course Type:</label>
          <input
            type="text"
            name="course_type"
            value={formValues.course_type || ""}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={`w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${!isEditing ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Description:</label>
          <textarea
            name="description"
            value={formValues.description || ""}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={`w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${!isEditing ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Price:</label>
          <input
            type="number"
            name="price"
            value={formValues.price || ""}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={`w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${!isEditing ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Year:</label>
          <input
            type="text"
            name="year"
            value={formValues.year || ""}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={`w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${!isEditing ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Month:</label>
          <select
            name="monthName"
            value={formValues.monthName || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${!isEditing ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
          >
            {[
              "JANUARY",
              "FEBRUARY",
              "MARCH",
              "APRIL",
              "MAY",
              "JUNE",
              "JULY",
              "AUGUST",
              "SEPTEMBER",
              "OCTOBER",
              "NOVEMBER",
              "DECEMBER",
            ].map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div>
  <label className="block text-gray-700 font-medium">Weeks:</label>
  <select
    name="weeks"
    value={formValues.weeks || ""}
    onChange={handleInputChange}
    disabled={!isEditing}
    className={`w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
      !isEditing ? "bg-gray-100 cursor-not-allowed" : ""
    }`}
  >
    <option value="" disabled>
      Select Weeks
    </option>
    <option value="4">4</option>
    <option value="5">5</option>
  </select>
</div>

        <div>
          <label className="block text-gray-700 font-medium">Start Date:</label>
          <input
            type="date"
            name="started_at"
            value={formatDate(formValues.started_at) || ""}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={`w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${!isEditing ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">End Date:</label>
          <input
            type="date"
            name="ended_at"
            value={formatDate(formValues.ended_at) || ""}
            onChange={handleInputChange}
            readOnly={!isEditing}
            className={`w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 ${!isEditing ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Image:</label>
          {formValues.image_url ? (
            <div className="flex items-center space-x-4">
              <img
                src={formValues.image_url}
                alt="Course"
                className="w-32 h-32 object-cover rounded"
              />
              <button
                type="button"
                onClick={handleDeleteImage}
                className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600"
              >
                Delete Photo
              </button>
            </div>
          ) : (
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => { setImageFile(e.target.files[0]) }}
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <button className='p-2 bg-blue-400' onClick={handleImageUpload}>Upload</button>
            </div>
          )}
        </div>
        <div className="flex justify-between mt-4">
          {isEditing ? (
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600"
            >
              Save Changes
            </button>
          ) : <div className='px-4 py-2'></div>}


          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600"
          >
            Edit
          </button>

          <button
            onClick={() => navigate(`/admin/course/${courseId}`)}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md shadow hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminEditCourse