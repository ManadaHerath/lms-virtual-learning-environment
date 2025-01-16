import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchStudents,
  deactivateStudentStatus,
} from "../features/students/StudentSlice";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import {
  Users,
  UserCheck,
  UserX,
  UserPlus,
  Trash2,
  AlertCircle,
} from "lucide-react";
import api from "../redux/api";

const StudentManagement = () => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list, status, error } = useSelector((state) => state.students);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [batchFilter, setBatchFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (list.students) {
      let filtered = list.students;

      if (batchFilter !== "all") {
        filtered = filtered.filter((student) => student?.batch === batchFilter);
      }

      if (statusFilter !== "all") {
        filtered = filtered.filter(
          (student) => student?.status === statusFilter
        );
      }

      if (searchQuery) {
        filtered = filtered.filter(
          (student) =>
            (student?.first_name || "")
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            (student?.last_name || "")
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            (student?.nic || "")
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            (student?.phone || "")
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            (student?.student_index || "")
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
        );
      }

      setFilteredStudents(filtered);
    } else {
      setFilteredStudents([]); // Set empty array if no students
    }
  }, [list.students, batchFilter, statusFilter, searchQuery]);

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  const uniqueBatches = Array.from(
    new Set(list.students?.map((student) => student.batch))
  );

  const handleStatus = (id, status) => {
    dispatch(deactivateStudentStatus({ id, status }))
      .unwrap()
      .then(() => dispatch(fetchStudents()))
      .catch((error) => console.error("Error toggling status:", error));
  };

  const handleDelete = async (nic) => {
    try {
      const response = await api.delete("/admin/students", {
        data: { nic: nic },
      });
      
      enqueueSnackbar(response.data.message,{variant:'success'})
      dispatch(fetchStudents());
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "text-green-400";
      case "INACTIVE":
        return "text-red-400";
      case "PENDING":
        return "text-yellow-400";
      default:
        return "text-gray-400";
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="flex items-center justify-center h-full text-red-400">
        <AlertCircle className="w-6 h-6 mr-2" />
        <span>Error: {error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sticky Header and Filters */}
      <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm z-10 pb-6">
        {/* Header */}
        <div className="flex justify-between items-center pt-6">
          <h1 className="text-2xl font-semibold text-gray-200 flex items-center">
            <Users className="w-6 h-6 mr-2 text-blue-400" />
            Student Management
          </h1>
        </div>

        {/* Filters */}
        <div className="flex space-x-4 pt-6">
          <select
            value={batchFilter}
            onChange={(e) => setBatchFilter(e.target.value)}
            className="bg-gray-800/50 border border-gray-700/50 text-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent"
          >
            <option value="all">All Batches</option>
            {uniqueBatches.map((batch) => (
              <option key={batch} value={batch}>
                {batch}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-800/50 border border-gray-700/50 text-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="PENDING">Pending</option>
          </select>

          {/* Search Input */}
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, NIC, ID or phone..."
            className="w-96 bg-gray-800/50 border border-gray-700/50 text-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-700/50">
        <table className="w-full">
          <thead className="bg-gray-800/50 border-b border-gray-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Index
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Batch
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/50">
            {Array.isArray(filteredStudents) && filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr
                  key={student.nic}
                  className="bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {student.student_index}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {student.nic}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {student.first_name + " " + student.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {student.batch}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`inline-flex items-center ${getStatusColor(
                        student.status
                      )}`}
                    >
                      {student.status === "ACTIVE" && (
                        <UserCheck className="w-4 h-4 mr-1" />
                      )}
                      {student.status === "INACTIVE" && (
                        <UserX className="w-4 h-4 mr-1" />
                      )}
                      {student.status === "PENDING" && (
                        <UserPlus className="w-4 h-4 mr-1" />
                      )}
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex justify-between items-center">
                      <div className="space-x-2">
                        {student.status === "PENDING" ? (
                          <button
                            onClick={() =>
                              navigate(`/admin/student/register/${student.nic}`)
                            }
                            className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors"
                          >
                            Review
                          </button>
                        ) : (
                          <>
                            {student.status !== "INACTIVE" && (
                              <button
                                onClick={() =>
                                  handleStatus(student.nic, "INACTIVE")
                                }
                                className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                              >
                                Deactivate
                              </button>
                            )}
                            {student.status !== "ACTIVE" && (
                              <button
                                onClick={() =>
                                  handleStatus(student.nic, "ACTIVE")
                                }
                                className="px-3 py-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors"
                              >
                                Activate
                              </button>
                            )}
                          </>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          navigate(`/admin/students/${student.nic}`)
                        }
                        className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => handleDelete(student.nic)}
                        className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded hover:bg-gray-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-400">
                  No students available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentManagement;
