import React, { useEffect, useState } from "react";
import { Camera, Edit2, Save, X, Mail, Phone, MapPin, Home } from "lucide-react";
import api from "../redux/api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadHover, setUploadHover] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/user/profile");
        if (!response.status === 200) throw new Error("Failed to fetch profile");
        setUser(response.data.user);
        setFormData(response.data.user);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
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
      const response = await api.put("/user/editprofile", formData);
      if (!response.status === 200) throw new Error("Failed to update profile");
      setUser(formData);
      setEditMode(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePictureChange = async () => {
    if (!imageFile) return;
    const formData = new FormData();
    formData.append("image", imageFile);
    try {
      const response = await api.put("/user/profile/picture", formData);
      if (!response.status === 200) throw new Error("Failed to update profile picture");
      setUser({ ...user, image_url: response.data.image_url });
      setImageFile(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePictureRemove = async () => {
    try {
      const response = await api.put("/user/profile/picture", { remove: true });
      if (!response.status === 200) throw new Error("Failed to remove profile picture");
      setUser({ ...user, image_url: null });
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <h3 className="text-red-800 font-medium mb-2">Error Loading Profile</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-12 relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative flex items-center gap-6">
              <div className="relative group">
                {user?.image_url ? (
                  <img
                    src={user.image_url}
                    alt="Profile"
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover ring-4 ring-white/30"
                  />
                ) : (
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/10 flex items-center justify-center ring-4 ring-white/30">
                    <Camera className="w-8 h-8 text-white/70" />
                  </div>
                )}
                <label
                  className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer transform transition-transform hover:scale-110"
                  onMouseEnter={() => setUploadHover(true)}
                  onMouseLeave={() => setUploadHover(false)}
                >
                  <Camera className="w-4 h-4 text-blue-600" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                  />
                </label>
                {user?.image_url && (
                  <button
                    onClick={handlePictureRemove}
                    className="absolute top-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer transform transition-transform hover:scale-110"
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                )}
              </div>
              <div className="text-white">
                <h1 className="text-2xl md:text-3xl font-bold">
                  {user?.first_name} {user?.last_name}
                </h1>
                <p className="text-blue-100 mt-1">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
              <div className="flex items-center gap-3">
                {!editMode && imageFile && (
                  <button
                    onClick={handlePictureChange}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Upload Picture
                  </button>
                )}
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                ) : null}
              </div>
            </div>

            {!editMode ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-gray-900">{user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-gray-900">{user?.telephone}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Location</p>
                      <p className="text-gray-900">
                        {user?.city}, {user?.province}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Home className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Address</p>
                      <p className="text-gray-900">{user?.street_address}</p>
                      <p className="text-gray-600">{user?.postal_code}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    placeholder="First Name"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                  />
                  <input
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                  />
                  <input
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleInputChange}
                    placeholder="Phone"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                  />
                </div>

                <textarea
                  name="street_address"
                  value={formData.street_address}
                  onChange={handleInputChange}
                  placeholder="Street Address"
                  rows="2"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                />

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                  />
                  <input
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    placeholder="Province"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                  />
                  <input
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleInputChange}
                    placeholder="Postal Code"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;