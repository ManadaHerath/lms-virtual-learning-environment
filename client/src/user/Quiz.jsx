import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const QuizPage = () => {
  const { quizId } = useParams(); // Get quizId from the URL
  const navigate = useNavigate(); // To navigate after submission
  const [quiz, setQuiz] = useState(null);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Function to upload file to Cloudinary
  const uploadFileToCloudinary = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "my_first_upload"); // Replace with your Cloudinary upload preset

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dxxa198zw/upload", // Replace with your Cloudinary cloud name
        formData
      );

      if (response.data.secure_url) {
        return response.data.secure_url; // Return the file URL
      } else {
        throw new Error("Failed to upload file to Cloudinary");
      }
    } catch (error) {
      console.error("Error uploading file:", error.message);
      throw error;
    }
  };

  // Fetch quiz details
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Retrieve token from secure storage
        const response = await axios.get(`http://localhost:3000/user/quiz/${quizId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        if (response.data.success) {
          setQuiz(response.data.quiz);
        } else {
          setError(response.data.message || "Failed to load quiz");
        }
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  // Handle response changes for MCQ questions
  const handleChange = (questionId, value) => {
    setResponses((prevResponses) => ({
      ...prevResponses,
      [questionId]: value,
    }));
  };

  // Handle quiz submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("authToken");
      const studentNic = localStorage.getItem("studentNIC"); // Ensure NIC is available

      // Upload files for essay questions before submitting the quiz
      const responsesWithFileUrls = await Promise.all(
        Object.entries(responses).map(async ([questionId, response]) => {
          if (typeof response === "object" && response instanceof File) {
            // If the response is a file (for essay questions)
            const uploadedFileUrl = await uploadFileToCloudinary(response);
            return {
              question_id: questionId,
              response_text: null, // No text response for file-based questions
              uploaded_file_url: uploadedFileUrl,
            };
          } else {
            // For MCQs or text responses
            return {
              question_id: questionId,
              response_text: typeof response === "string" ? response : null,
              uploaded_file_url: null,
            };
          }
        })
      );

      const payload = {
        quiz_id: quizId,
        student_nic: studentNic,
        responses: responsesWithFileUrls,
      };

      const response = await axios.post(
        "http://localhost:3000/user/submit-quiz", // Adjust API URL as needed
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setMessage(`Quiz submitted successfully! Total Marks: ${response.data.totalMarks}`);
        // Optionally navigate to results page or show further feedback
        setTimeout(() => navigate("/user/mycourse"), 3000);
      } else {
        setError(response.data.message || "Failed to submit quiz");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-lg">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500 text-lg">{error}</div>;
  }

  if (!quiz) {
    return <div className="flex justify-center items-center min-h-screen text-lg">No quiz data available</div>;
  }

  return (
    <div className="quiz-page bg-gray-50 min-h-screen py-10 px-5">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{quiz.title}</h1>
        <p className="text-gray-600 mb-6">{quiz.description}</p>
        {message && <div className="text-green-600 font-semibold mb-4">{message}</div>}
        <form className="quiz-form" onSubmit={handleSubmit}>
          {quiz.questions.map((question, index) => (
            <div
              key={question.id}
              className="quiz-question mb-6 p-4 bg-gray-100 rounded-lg shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Q{index + 1}: {question.question_text}
              </h3>
              {question.question_type === "mcq" ? (
                <div className="mcq-options space-y-2">
                  {question.options.map((option) => (
                    <div key={option.id}>
                      <label className="flex items-center space-x-3 text-gray-700">
                        <input
                          type="radio"
                          name={`question_${question.id}`}
                          value={option.option_text}
                          onChange={(e) => handleChange(question.id, e.target.value)}
                          className="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-400"
                        />
                        <span>{option.option_text}</span>
                      </label>
                    </div>
                  ))}
                </div>
              ) : question.question_type === "essay" ? (
                <div>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleChange(question.id, e.target.files[0])}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-400 focus:border-blue-400"
                  />
                  {responses[question.id] && (
                    <p className="text-blue-600 mt-2">
                      File uploaded: <a href={responses[question.id]} target="_blank" rel="noopener noreferrer">View File</a>
                    </p>
                  )}
                </div>
              ) : null}
            </div>
          ))}
          <button
            type="submit"
            className="mt-4 w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuizPage;
