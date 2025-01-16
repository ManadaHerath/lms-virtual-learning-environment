import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../redux/api";
import { useSnackbar } from "notistack";
import moment from "moment-timezone";
import { useNavigate } from "react-router-dom";
const EditQuiz = () => {
  const navigate=useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { quizId } = useParams();

  const [quiz, setQuiz] = useState({
    title: "",
    description: "",
    open_time: "",
    close_time: "",
    time_limit_minutes: "",
    review_available_time: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizInfo = async () => {
      try {
        const response = await api.get(`/admin/quiz/${quizId}`);
        if (response.status !== 200) {
          throw new Error("Failed to fetch quiz details");
        }
        const data = response.data;
        if (!data.success) {
          throw new Error(data.message || "Quiz not found");
        }

        // Set the quiz state with the fetched data
        setQuiz({
          title: data.quiz.title,
          description: data.quiz.description,
          open_time: moment(data.quiz.open_time).format("YYYY-MM-DDTHH:mm"),
          close_time: moment(data.quiz.close_time).format("YYYY-MM-DDTHH:mm"),
          time_limit_minutes: data.quiz.time_limit_minutes,
          review_available_time: moment(data.quiz.review_available_time).format("YYYY-MM-DDTHH:mm"),
        });
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchQuizInfo();
  }, [quizId]);

  const handleInputChange = (e) => {
    setQuiz({ ...quiz, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.put(`/admin/quiz/${quizId}`, quiz);
      const data = response.data;
      if (data.success) {
        enqueueSnackbar("Quiz updated successfully!", { variant: "success" });
        navigate('/admin/quiz-list')
      } else {
        enqueueSnackbar(data.message || "Failed to update quiz.", { variant: "error" });
      }
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar("An error occurred. Please try again.", { variant: "error" });
    }
  };

  if (loading) {
    return <div className="text-center text-gray-300">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gray-900 min-h-screen p-6 text-gray-300">
      <h1 className="text-2xl font-bold mb-6">Edit Quiz</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">Quiz Title:</label>
          <input
            type="text"
            name="title"
            value={quiz.title}
            onChange={handleInputChange}
            placeholder="Quiz Title"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">Quiz Description:</label>
          <textarea
            name="description"
            value={quiz.description}
            onChange={handleInputChange}
            placeholder="Quiz Description"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
          />
        </div>
        <div>
          <label htmlFor="open_time" className="block text-sm font-medium mb-1">Open Time:</label>
          <input
            type="datetime-local"
            name="open_time"
            value={quiz.open_time}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="time_limit_minutes" className="block text-sm font-medium mb-1">Time Limit (Minutes):</label>
          <input
            type="number"
            name="time_limit_minutes"
            value={quiz.time_limit_minutes}
            onChange={handleInputChange}
            placeholder="Time Limit (Minutes)"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="review_available_time" className="block text-sm font-medium mb-1">Review Available Time:</label>
          <input
            type="datetime-local"
            name="review_available_time"
            value={quiz.review_available_time}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditQuiz;