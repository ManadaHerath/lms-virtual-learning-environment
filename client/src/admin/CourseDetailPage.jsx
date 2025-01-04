import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEnrolledStudents } from "../features/students/StudentSlice";
import { useParams } from "react-router-dom";
import AddStudentModal from "./AddStudentModal"; // Import Modal Component

const CourseDetailPage = () => {
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Course Detail Page</h1>

      {status === "loading" && <p>Loading students...</p>}
      {status === "failed" && <p className="text-red-500">{error}</p>}

      {/* Filters and Add Button */}
      <div className="mb-4 flex gap-4 justify-between">
        <div className="flex gap-4">
          <select
            className="border rounded px-2 py-1"
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
          >
            <option value="">All Payment Status</option>
            <option value="PAID">Paid</option>
            <option value="NOT PAID">Unpaid</option>
          </select>
          <select
            className="border rounded px-2 py-1"
            value={mediumFilter}
            onChange={(e) => setMediumFilter(e.target.value)}
          >
            <option value="">All Mediums</option>
            <option value="PHYSICAL">Physical</option>
            <option value="ONLINE">Online</option>
          </select>
          <input
            type="text"
            className="border rounded px-2 py-1"
            placeholder="Search by name, NIC, or phone"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => setShowModal(true)}
        >
          + Add Student
        </button>
        {showModal && (
          <AddStudentModal
            onClose={() => setShowModal(false)}
            courseId={courseId}
          />
        )}
      </div>

      {status === "succeeded" && filteredStudents.length > 0 ? (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Phone Number</th>
              <th className="border border-gray-300 px-4 py-2">
                Payment Status
              </th>
              <th className="border border-gray-300 px-4 py-2">Medium</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.nic}>
                <td className="border border-gray-300 px-4 py-2">
                  {student.first_name + " " + student.last_name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {student.telephone}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {student.payment_status}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {student.medium}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No students match the filters or search criteria.</p>
      )}
    </div>
  );
};

export default CourseDetailPage;
