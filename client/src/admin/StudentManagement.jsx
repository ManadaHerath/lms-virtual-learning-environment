import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchStudents, deactivateStudentStatus } from "../features/students/StudentSlice";
import { useNavigate } from "react-router-dom";

const StudentManagement = () => {
  const dispatch = useDispatch();
  const { list, status, error } = useSelector((state) => state.students);
  const navigate=useNavigate()
  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

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
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
  {Array.isArray(list.students) && list.students.length > 0 ? (
    list.students.map((student) => (
      <tr key={student.nic}>
        <td>{student.nic}</td>
        <td>{student.first_name}</td>
        <td>{student.status}</td>
        
        
        <td>
          <button className="px-4" onClick={() => handleStatus(student.nic,'INACTIVE')}>
            Deactivate
          </button>
          <button className="px-4" onClick={() => handleStatus(student.nic,'ACTIVE')}>
            Activate
          </button>
          {student.status === "PENDING" ? <button className="px-4" onClick={() => navigate(`/admin/student/register/${student.nic}`)}>
            Pending
          </button> : <></> }
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="4" className="text-center">
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
