import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Book, Clock, PlusCircle, Calendar, Edit, Trash } from "lucide-react";
import api from "../redux/api";
import { useSnackbar } from "notistack";
import moment from "moment-timezone";

const QuizManagement = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  useEffect(() => {
    filterQuizzes();
  }, [status, quizzes]); // Re-filter when status or quizzes change

  const fetchQuizzes = async () => {
    try {
      const res = await api.get("/admin/quizzes");
      if (!res.data.success) {
        throw new Error("Failed to load quizzes");
      }
      setQuizzes(res.data.quizzes);
      setFilteredQuizzes(res.data.quizzes); // Initialize with all quizzes
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  const filterQuizzes = () => {
    if (!status) {
      setFilteredQuizzes(quizzes);
      return;
    }

    const now = moment().tz("Asia/Colombo").valueOf();

    const filtered = quizzes.filter((quiz) => {
      const open = moment.utc(quiz.open_time).tz("Asia/Colombo").valueOf();
      const close = moment.utc(quiz.close_time).tz("Asia/Colombo").valueOf();

      if (status === "upcoming") return now < open;
      if (status === "active") return now >= open && now <= close;
      if (status === "closed") return now > close;

      return true;
    });

    setFilteredQuizzes(filtered);
  };

  const handleDelete = async (quizId) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      try {
        const res = await api.delete(`/admin/quiz/${quizId}`);
        if (res.data.success) {
          enqueueSnackbar(res.data.message, { variant: "success" });
        } else {
          enqueueSnackbar(res.data.message, { variant: "error" });
        }
        fetchQuizzes();
      } catch (error) {
        enqueueSnackbar("Error deleting quiz:", { variant: "error" });
        console.error("Error deleting quiz:", error);
      }
    }
  };

  const getQuizStatusColor = (openTime, closeTime) => {
    const now = moment().tz("Asia/Colombo").valueOf();
    const open = moment.utc(openTime).tz("Asia/Colombo").valueOf();
    const close = moment.utc(closeTime).tz("Asia/Colombo").valueOf();

    if (now < open) return "bg-yellow-500/20 text-yellow-400"; // Upcoming
    if (now > close) return "bg-red-500/20 text-red-400"; // Closed
    return "bg-green-500/20 text-green-400"; // Active
  };

  const getQuizStatus = (openTime, closeTime) => {
    const now = moment().tz("Asia/Colombo").valueOf();
    const open = moment.utc(openTime).tz("Asia/Colombo").valueOf();
    const close = moment.utc(closeTime).tz("Asia/Colombo").valueOf();

    if (now < open) return "Upcoming";
    if (now > close) return "Closed";
    return "Active";
  };

  const formatDateTime = (dateString) => {
    return moment.utc(dateString).tz("Asia/Colombo").format("YYYY-MM-DD HH:mm:ss");
  };

  return (
    <div className="space-y-6">
      {/* Sticky Header and Filters */}
      <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm z-10 pb-6">
        {/* Header */}
        <div className="flex justify-between items-center pt-6">
          <h1 className="text-2xl font-semibold text-gray-200 flex items-center">
            <Book className="w-6 h-6 mr-2 text-blue-400" />
            Quiz Management
          </h1>
          <button
            onClick={() => navigate("../create-quiz")}
            className="flex items-center px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Create Quiz
          </button>
        </div>

        {/* Filters */}
        <div className="flex space-x-4 pt-6">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-gray-800/50 border border-gray-700/50 text-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Quiz Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuizzes.length > 0 ? (
          filteredQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="group bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg overflow-hidden hover:border-gray-600/50 transition-all duration-200"
            >
              <div className="p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold text-gray-200 group-hover:text-blue-400 transition-colors">
                    {quiz.title}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getQuizStatusColor(
                      quiz.open_time,
                      quiz.close_time
                    )}`}
                  >
                    {getQuizStatus(quiz.open_time, quiz.close_time)}
                  </span>
                </div>

                <p className="text-gray-400 text-sm">{quiz.description}</p>

                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Opens: {formatDateTime(quiz.open_time)}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Closes: {formatDateTime(quiz.close_time)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Time Limit: {quiz.time_limit_minutes} minutes</span>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    onClick={() => navigate(`../edit-quiz/${quiz.id}`)}
                    className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors text-sm flex items-center"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(quiz.id)}
                    className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors text-sm flex items-center"
                  >
                    <Trash className="w-4 h-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex items-center justify-center py-12 text-gray-400">
            <Book className="w-6 h-6 mr-2" />
            <span>No quizzes found</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizManagement;
