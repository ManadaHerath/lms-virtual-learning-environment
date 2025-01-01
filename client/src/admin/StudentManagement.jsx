import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchStudents, toggleStudentStatus } from "../features/students/StudentSlice";

const StudentManagement = () => {
  const dispatch = useDispatch();
  const { list, status, error } = useSelector((state) => state.students);

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
          {list.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>{student.active ? "Active" : "Inactive"}</td>
              <td>
                <button onClick={() => handleToggleStatus(student.id)}>
                  Toggle Status
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentManagement;
