import React, { useState, useEffect } from 'react';
import api from '../redux/api';
import { Camera, Upload, Loader2 } from 'lucide-react';

const Registration = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await api.get(`/user/register`);
        if (res.data.image_url) {
          setExistingImageUrl(res.data.image_url);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching image:');
        setLoading(false);
      }
    };
    fetchImage();
  }, []);

  useEffect(() => {
    if (image) {
      const objectUrl = URL.createObjectURL(image);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [image]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setImage(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('image', image);
      
      if (existingImageUrl) {
        await api.put('/user/register', data);
      } else {
        await api.post('/user/register', data);
      }
      
      setSuccess(true);
      setLoading(false);
    } catch (error) {
      console.error('Error submitting image:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Student Registration
              </h1>
              <p className="text-gray-600">
                Please upload your picture with holding NIC
              </p>
            </div>

            <div className="space-y-6">
              {existingImageUrl ? (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={existingImageUrl}
                      alt="Current"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg">
                      <p className="text-white text-lg font-medium">Current Image</p>
                    </div>
                  </div>
                </div>
              ) : null}

              <div
                className={`relative border-2 border-dashed rounded-lg p-8 transition-all ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">
                      Drag and drop your image here, or{' '}
                      <span className="text-blue-500 font-medium">browse</span>
                    </p>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    PNG, JPG up to 10MB
                  </p>
                </div>
              </div>

              {preview && (
                <div className="relative rounded-lg overflow-hidden">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-64 object-cover"
                  />
                  <button
                    onClick={() => {
                      setImage(null);
                      setPreview(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <span className="sr-only">Remove</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={!image || loading}
                className={`w-full py-3 px-4 border border-transparent rounded-lg text-white font-medium ${
                  !image || loading
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200'
                } transition-all duration-200 flex items-center justify-center space-x-2`}
              >
                {loading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <Camera className="h-5 w-5" />
                )}
                <span>
                  {existingImageUrl ? 'Update Image' : 'Upload Image'}
                </span>
              </button>

              {success && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-green-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700">
                        Image successfully {existingImageUrl ? 'updated' : 'uploaded'}!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;