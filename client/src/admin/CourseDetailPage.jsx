import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEnrolledStudents } from "../features/students/StudentSlice";
import { useParams } from "react-router-dom";
import AddStudentModal from "./AddStudentModal"; // Import Modal Component
import { Search, PlusCircle, AlertCircle } from "lucide-react";

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
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold text-gray-200 mb-6 flex items-center">
        <AlertCircle className="w-6 h-6 mr-2 text-blue-400" />
        Course Detail Page
      </h1>

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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {student.payment_status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {student.medium}
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