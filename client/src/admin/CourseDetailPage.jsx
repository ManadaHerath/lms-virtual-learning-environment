import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEnrolledStudents } from "../features/students/StudentSlice";
import { useParams } from "react-router-dom";
import AddStudentModal from "./AddStudentModal"; // Import Modal Component
import { Search, PlusCircle, AlertCircle, CheckCircle, XCircle, Monitor, User } from "lucide-react";
import { useSnackbar } from "notistack";
import api from "../redux/api";
const CourseDetailPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { courseId } = useParams();
  const dispatch = useDispatch();

  const {
    list: students,
    status,
    error,
  } = useSelector((state) => state.students);
  const [paymentFilter, setPaymentFilter] = useState("");
  const [mediumFilter, setMediumFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  const [confirmUnenroll, setConfirmUnenroll] = useState(false); // Popup visibility state
  const [targetStudent, setTargetStudent] = useState(null); // Target student for unenroll action

  

  useEffect(() => {
    dispatch(fetchEnrolledStudents(courseId));
  }, [dispatch, courseId]);

  const filteredStudents = students.students
    ?.filter((student) =>
      paymentFilter ? student.payment_status === paymentFilter : true
    )
    .filter((student) =>
      mediumFilter ? student.medium === mediumFilter : true
    )
    .filter((student) =>
      searchQuery
        ? student.first_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        student.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.nic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.telephone.includes(searchQuery)
        : true
    );

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return "text-green-400";
      case "NOT PAID":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getPaymentStatusIcon = (status) => {
    switch (status) {
      case "PAID":
        return <CheckCircle className="w-4 h-4 mr-2" />;
      case "NOT PAID":
        return <XCircle className="w-4 h-4 mr-2" />;
      default:
        return null;
    }
  };

  const getMediumColor = (medium) => {
    switch (medium) {
      case "PHYSICAL":
        return "text-blue-400";
      case "ONLINE":
        return "text-purple-400";
      default:
        return "text-gray-400";
    }
  };

  const getChangeMediumColor = (medium) => {
    switch (medium) {
      case "PHYSICAL":
        return "text-purple-400";
      case "ONLINE":
        return "text-blue-400";
      default:
        return "text-gray-400";
    }
  };

  const getMediumIcon = (medium) => {
    switch (medium) {
      case "PHYSICAL":
        return <User className="w-4 h-4 mr-2" />;
      case "ONLINE":
        return <Monitor className="w-4 h-4 mr-2" />;
      default:
        return null;
    }
  };

  const handleUnenroll=async(nic)=>{
    try {
      const response=await api.delete(`/admin//course/${courseId}/nic/${nic}`);
      if(response.data.success){
        enqueueSnackbar(response.data.message, { variant: "success" });
        dispatch(fetchEnrolledStudents(courseId));
      }else{
        enqueueSnackbar(response.data.message, { variant: "error" });
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar('Error in unenrolling student', { variant: "error" });
    }
    setConfirmUnenroll(false); // Close confirmation popup

  }
  const handleOpenConfirmation = (student) => {
    setTargetStudent(student); // Set the target student
    setConfirmUnenroll(true); // Show confirmation dialog
  };

  const handleCancelUnenroll = () => {
    setConfirmUnenroll(false); // Close the confirmation dialog
    setTargetStudent(null); // Reset the target student
  };


  const handleChangeMedium=async(nic,medium)=>{
    try {
      const res=await api.put('/admin/course/nic/medium',{nic:nic,medium:medium,courseId:courseId})
      if(res.data.success){
        enqueueSnackbar(res.data.message, { variant: "success" });
        dispatch(fetchEnrolledStudents(courseId));
      }else{
        enqueueSnackbar(res.data.message, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar('Error in changing medium', { variant: "error" });
      console.log(error);
    }

  }



  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold text-gray-200 mb-6 flex items-center">
        <AlertCircle className="w-6 h-6 mr-2 text-blue-400" />
        Course Detail Page
      </h1>

            {/* Confirmation Popup */}
            {confirmUnenroll && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold text-gray-800">
              Are you sure you want to unenroll{" "}
              <span className="text-red-500">{targetStudent?.first_name} {targetStudent?.last_name}</span>?
            </h2>
            <div className="mt-4 flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                onClick={handleCancelUnenroll}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => handleUnenroll(targetStudent?.nic)}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}


      {status === "loading" && (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
      )}
      {status === "failed" && (
        <div className="flex items-center justify-center h-full text-red-400">
          <AlertCircle className="w-6 h-6 mr-2" />
          <span>Error: {error}</span>
        </div>
      )}

      {/* Filters and Add Button */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex gap-4">
          <select
            className="bg-gray-800/50 border border-gray-700/50 text-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent"
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
          >
            <option value="">All Payment Status</option>
            <option value="PAID">Paid</option>
            <option value="NOT PAID">Unpaid</option>
          </select>
          <select
            className="bg-gray-800/50 border border-gray-700/50 text-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent"
            value={mediumFilter}
            onChange={(e) => setMediumFilter(e.target.value)}
          >
            <option value="">All Mediums</option>
            <option value="PHYSICAL">Physical</option>
            <option value="ONLINE">Online</option>
          </select>
          <div className="relative">
            <input
              type="text"
              className="bg-gray-800/50 border border-gray-700/50 text-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent"
              placeholder="Search by name, NIC, or phone"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>
        </div>
        <button
          className="flex items-center px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
          onClick={() => setShowModal(true)}
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Add Student
        </button>
        {showModal && (
          <AddStudentModal
            onStudentsUpdated={() => dispatch(fetchEnrolledStudents(courseId))}
            onClose={() => setShowModal(false)}
            courseId={courseId}
          />
        )}
      </div>

      {status === "succeeded" && filteredStudents.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-gray-700/50">
          <table className="w-full">
            <thead className="bg-gray-800/50 border-b border-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Phone Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Payment Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Medium
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Change Medium
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Action
                </th>

              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {filteredStudents.map((student) => (
                <tr
                  key={student.nic}
                  className="bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {student.first_name + " " + student.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {student.telephone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className={`flex items-center ${getPaymentStatusColor(student.payment_status)}`}>
                      {getPaymentStatusIcon(student.payment_status)}
                      {student.payment_status}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className={`flex items-center ${getMediumColor(student.medium)}`}>
                      {getMediumIcon(student.medium)}
                      {student.medium}
                    </div>
                  </td>
                  <td className="px-6  justify-between py-4 whitespace-nowrap text-sm items-center">
                    <button 
                    onClick={()=>{handleChangeMedium(student.nic,student.medium === "PHYSICAL" ? "ONLINE" : student.medium === "ONLINE" ? "PHYSICAL" : "")} }
                    className={`px-3 w-full py-1 rounded hover:bg-${student.medium === "PHYSICAL" ? "purple" : student.medium === "ONLINE" ? "blue" : "gray"}-500/30 transition-colors ${getChangeMediumColor(student.medium)}`}>
                        
                      {student.medium === "PHYSICAL" ? "ONLINE" : student.medium === "ONLINE" ? "PHYSICAL" : ""}
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={()=>{handleOpenConfirmation(student)}}
                      className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                    >
                      Unenroll
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-400">No students match the filters or search criteria.</p>
      )}
    </div>
  );
};

export default CourseDetailPage;