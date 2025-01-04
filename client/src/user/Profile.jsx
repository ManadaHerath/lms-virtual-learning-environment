import React, { useEffect, useState } from "react";
import api from "../redux/api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {

        const response = await api.get("/user/profile");

        if (!response.status == 200) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.data;
        setUser(data.user);
        setFormData(data.user);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    
    e.preventDefault();
    try {
      
      const response = await api.put('/user/editprofile',formData);

      if (!response.status == 200) {
        throw new Error("Failed to update profile");
      }

      const data = await response.data;
      alert(data.message);
      setEditMode(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePictureChange = async () => {
    const dataa = new FormData();
    dataa.append("image", imageFile);
    try {

      const response = await api.put("/user/profile/picture",dataa);

      if (!response.status == 200) {
        throw new Error("Failed to update profile picture");
      }

      const data = await response.data;
      alert(data.message);
      setUser({ ...user, image_url: data.image_url });
      setImageFile(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePictureRemove = async () => {
    try {

      const response = await api.put("/user/profile/picture", { remove: true });

      if (!response.status == 200) {
        throw new Error("Failed to remove profile picture");
      }

      const data = await response.data;
      alert(data.message);
      setUser({ ...user, image_url: null });
    } catch (err) {
      alert(err.message);
    }
  };

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!user) {
    return <div className="p-4 text-blue-500">Loading profile...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>
      <div className="flex items-center space-x-4 mb-4">
        {user.image_url ? (
          <img
            src={user.image_url}
            alt="Profile"
            className="w-24 h-24 rounded-full border-2 border-gray-300"
          />
        ) : (
          <div className="w-24 h-24 rounded-full border-2 border-gray-300 flex items-center justify-center bg-gray-100">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
      </div>
      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
        <button
          onClick={handlePictureChange}
          className="p-2 bg-blue-500 text-white rounded ml-2"
        >
          Change Picture
        </button>
        <button
          onClick={handlePictureRemove}
          className="p-2 bg-red-500 text-white rounded ml-2"
        >
          Remove Picture
        </button>
      </div>

      {!editMode ? (
        <>
          <div className="mb-2">
            <strong>Name:</strong> {user.first_name} {user.last_name}
          </div>
          <div className="mb-2">
            <strong>Email:</strong> {user.email}
          </div>
          <div className="mb-2">
            <strong>Phone:</strong> {user.telephone}
          </div>
          <div className="mb-2">
            <strong>Address:</strong> {user.street_address}, {user.city},{" "}
            {user.province}, {user.postal_code}, {user.country}
          </div>
          <button
            className="p-2 bg-blue-500 text-white rounded"
            onClick={() => setEditMode(true)}
          >
            Edit Profile
          </button>
        </>
      ) : (
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            placeholder="First Name"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            placeholder="Last Name"
            className="w-full p-2 border rounded"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="telephone"
            value={formData.telephone}
            onChange={handleInputChange}
            placeholder="Phone"
            className="w-full p-2 border rounded"
          />
          <textarea
            name="street_address"
            value={formData.street_address}
            onChange={handleInputChange}
            placeholder="Street Address"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="City"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="province"
            value={formData.province}
            onChange={handleInputChange}
            placeholder="Province"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="postal_code"
            value={formData.postal_code}
            onChange={handleInputChange}
            placeholder="Postal Code"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            placeholder="Country"
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="p-2 bg-green-500 text-white rounded"
          >
            Save Changes
          </button>
        </form>
      )}
    </div>
  );
};

export default Profile;
