import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import api from "../redux/api";
import { useSnackbar } from "notistack";

const AddStudentModal = ({ onClose, courseId,onStudentsUpdated }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api.get("/admin/students/active");
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
        enqueueSnackbar("Error fetching students", { variant: "error" });
      }
    };
    fetchStudents();
  }, [query]);

  useEffect(() => {
    const searchUsers = () => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const filteredStudents = students.students.filter(
          (student) =>
            student.first_name?.toLowerCase().includes(query.toLowerCase()) ||
            student.last_name?.toLowerCase().includes(query.toLowerCase()) ||
            student.nic?.toLowerCase().includes(query.toLowerCase()) ||
            student.telephone?.includes(query)
        );
        setSuggestions(filteredStudents);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimeout = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimeout);
  }, [query, students]);

  const handleAddUser = (student) => {
    setSelectedUsers((prev) => {
      const next = new Set(prev);
      next.add(student);
      return next;
    });
    setQuery("");
    setSuggestions([]);
  };

  const handleRemoveUser = (student) => {
    setSelectedUsers((prev) => {
      const next = new Set(prev);
      next.delete(student);
      return next;
    });
  };

  const handleSubmit = async (medium) => {
    try {
      const enrollments = Array.from(selectedUsers).map((student) => ({
        student_id: student.nic,
        course_id: courseId,
        medium: medium,
      }));
      
      const respones= await api.post("/admin/student/payment", { enrollments });
      
      enqueueSnackbar("Students successfully added!", { variant: "success" });

      
        onStudentsUpdated();
      // Wait 2 seconds before reloading
      onClose();
    } catch (error) {
      enqueueSnackbar("Failed to add students. Please try again.", {
        variant: "error",
      });
      console.error("Error enrolling students:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Add Students</h2>
          <p className="text-sm text-gray-600">
            Enroll students in this course
          </p>
        </div>

        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border rounded-md"
              placeholder="Search by name, NIC, or phone number"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {isLoading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            </div>
          )}

          {suggestions.length > 0 && (
            <ul className="mt-2 border rounded-md divide-y max-h-60 overflow-y-auto">
              {suggestions.map((student) => (
                <li
                  key={student.id}
                  className="p-3 hover:bg-gray-50 flex items-center justify-between cursor-pointer"
                  onClick={() => handleAddUser(student)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      {student.first_name[0]}
                    </div>
                    <div>
                      <div className="font-medium">{`${student.first_name} ${student.last_name}`}</div>
                      <div className="text-sm text-gray-500">
                        NIC: {student.nic}
                      </div>
                      <div className="text-sm text-gray-500">
                        Tel: {student.telephone}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {selectedUsers.size > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Selected students</h3>
              <ul className="space-y-2">
                {Array.from(selectedUsers).map((student) => (
                  <li
                    key={student.id}
                    className={`flex items-center justify-between rounded-md p-2 bg-gray-50`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                        {student.first_name[0]}
                      </div>
                      <span>{`${student.first_name} ${student.last_name}`}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveUser(student);
                      }}
                      className={`text-gray-500 hover:text-red-500`}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="p-4 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={() => handleSubmit("PHYSiCAL")}
            disabled={selectedUsers.size === 0}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add as Physical
          </button>
          <button
            onClick={() => handleSubmit("ONLINE")}
            disabled={selectedUsers.size === 0}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add as Online
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStudentModal;
