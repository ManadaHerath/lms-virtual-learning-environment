import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchStudents, deactivateStudentStatus } from "../features/students/StudentSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const StudentManagement = () => {
  const dispatch = useDispatch();
  const { list, status, error } = useSelector((state) => state.students);
  const navigate=useNavigate()
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [batchFilter, setBatchFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  useEffect(() => {
    if (list.students) {
      let filtered = list.students;

      if (batchFilter !== "all") {
        filtered = filtered.filter((student) => student.batch === batchFilter);
      }

      if (statusFilter !== "all") {
        filtered = filtered.filter((student) => student.status === statusFilter);
      }

      

      setFilteredStudents(filtered);
    }
  }, [list.students, batchFilter, statusFilter]);
  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);
  const uniqueBatches = Array.from(new Set(list.students?.map((student) => student.batch)));
  const handleStatus = (id, status) => {
    dispatch(deactivateStudentStatus({ id, status }))
      .unwrap() // Waits for the action to complete
      .then(() => {
        // After the status is toggled, fetch the updated list of students
        dispatch(fetchStudents());
      })
      .catch((error) => {
        console.error("Error toggling status:", error);
      });
  };
  

  if (status === "loading") return <p>Loading students...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  return (
    <div>
    <h1>Student Management</h1>

    {/* Filters */}
    <div className="mb-4 flex space-x-4">
      {/* Batch Filter */}
      <select
        value={batchFilter}
        onChange={(e) => setBatchFilter(e.target.value)}
        className="border px-3 py-2 rounded"
      >
        <option value="all">All Batches</option>
        {uniqueBatches.map((batch) => (
          <option key={batch} value={batch}>
            {batch}
          </option>
        ))}
      </select>

      {/* Status Filter */}
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="border px-3 py-2 rounded"
      >
        <option value="all">All Statuses</option>
        <option value="ACTIVE">Active</option>
        <option value="INACTIVE">Inactive</option>
        <option value="PENDING">Pending</option>
      </select>

      {/* Medium Filter */}
      
    </div>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Batch</th>
          
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(filteredStudents) && filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <tr key={student.nic}>
              <td>{student.nic}</td>
              <td>{student.first_name + " " + student.last_name}</td>
              <td>{student.batch}</td>
              
              <td>{student.status}</td>
              <td>
                <button
                  className="px-4 bg-red-500"
                  onClick={() => handleStatus(student.nic, "INACTIVE")}
                >
                  Deactivate
                </button>
                <button
                  className="px-4 bg-green-700"
                  onClick={() => handleStatus(student.nic, "ACTIVE")}
                >
                  Activate
                </button>
                {student.status === "PENDING" ? (
                  <button
                    className="px-4 bg-blue-600"
                    onClick={() => navigate(`/admin/student/register/${student.nic}`)}
                  >
                    Pending
                  </button>
                ) : null}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="text-center">
              No students available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
  );
};

export default StudentManagement;
