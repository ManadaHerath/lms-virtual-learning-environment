import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { deactivateStudentStatus } from "../features/students/StudentSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../redux/api";
import { UserCheck, UserX, AlertCircle } from "lucide-react";

const ApproveRejectRegistration = () => {
  const dispatch = useDispatch();
  const { nic } = useParams();
  const [image_url, setImageUrl] = useState("");
  const navigate = useNavigate();

  const handleStatus = (status) => {
    dispatch(deactivateStudentStatus({ id: nic, status }))
      .unwrap()
      .then(() => {
        alert("Successfully updated status of student: " + nic + " to " + status);
        navigate("/admin/student");
      })
      .catch((error) => {
        console.error("Error toggling status: " + status, error);
      });
  };

  useEffect(() => {
    const getImage = async () => {
      try {
        const res = await api.get(`/admin/register/${nic}`);
        setImageUrl(res.data.image_url);
      } catch (error) {
        console.error("Error getting image", error);
      }
    };

    getImage();
  }, [nic]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold text-gray-200 flex items-center mb-6">
        <AlertCircle className="w-6 h-6 mr-2 text-blue-400" />
        Approve/Reject Registration
      </h1>

      {image_url ? (
        <div className="flex flex-col items-center space-y-6">
          <img
            src={image_url}
            alt="Uploaded by user"
            className="w-64 h-64 object-cover rounded-lg shadow-md border border-gray-700/50"
          />
          <div className="flex space-x-4">
            <button
              className="flex items-center px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
              onClick={() => handleStatus("ACTIVE")}
            >
              <UserCheck className="w-5 h-5 mr-2" />
              Approve
            </button>
            <button
              className="flex items-center px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
              onClick={() => handleStatus("INACTIVE")}
            >
              <UserX className="w-5 h-5 mr-2" />
              Reject
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-400">Loading image...</p>
      )}
    </div>
  );
};

export default ApproveRejectRegistration;