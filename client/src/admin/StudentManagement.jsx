import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchStudents, toggleStudentStatus } from "../features/students/StudentSlice";

const StudentManagement = () => {
  const dispatch = useDispatch();
  const { list, status, error } = useSelector((state) => state.students);
  console.log(list)
  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  const handleToggleStatus = (id) => {
    dispatch(toggleStudentStatus(id));
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
        <td>{student.status ? "Active" : "Inactive"}</td>
        <td>
          <button onClick={() => handleToggleStatus(student.id)}>
            Toggle Status
          </button>
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
