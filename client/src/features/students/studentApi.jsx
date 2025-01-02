import api from "../../redux/api";

// Fetch all students
export const fetchStudentsAPI = async () => {
  try {
    const response = await api.get("/admin/students");
    return response.data; // Return the data on successful response
  } catch (error) {
    // Handle API errors
    console.error("Error fetching students:", error);
    // Throw a custom error message or the original error
    throw new Error(error.response?.data?.message || "Failed to fetch students");
  }
};

// Toggle student status
export const deactivateStudentStatusAPI = async (id, status) => {
  try {

    const response = await api.patch(`/admin/students`, { nic: id, status: status });
    return response.data; // Return the updated student data
  } catch (error) {
    // Handle API errors
    console.error("Error toggling student status:", error);
    // Throw a custom error message or the original error
    throw new Error(error.response?.data?.message || "Failed to toggle student status");
  }
};
