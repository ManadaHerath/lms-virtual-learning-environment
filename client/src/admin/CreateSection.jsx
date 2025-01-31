import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../redux/api";
import { useSnackbar } from "notistack";

const CreateSection = () => {
  const { courseId, weekId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [orderId, setOrderId] = useState();
  const [typeId, setTypeId] = useState("");
  const [contentUrl, setContentUrl] = useState("");
  const [typeData, setTypeData] = useState({});
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [documentFile, setDocumentFile] = useState(null); // <-- NEW
  const [isQuiz, setIsQuiz] = useState(false);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleChooseQuiz = (quizId) => {
    const quiz = quizzes.find((quiz) => quiz.id === parseInt(quizId));
    setSelectedQuiz(quiz);
  };

  useEffect(() => {
    if (typeId === "3") {
      setIsQuiz(true);
      handleGetQuiz();
    } else {
      setIsQuiz(false);
    }
  }, [typeId]);

  const handleGetQuiz = async () => {
    try {
      const res = await api.get("/admin/quizzes");
      if (!res.data.success) {
        throw new Error("Failed to load quizzes");
      }
      setQuizzes(res.data.quizzes);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: "error" });
    }
  };

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await api.get("/type");
        if (res.data.result.success) {
          const dictionary = res.data.result.data.reduce((acc, item) => {
            acc[item.type_id] = item.type;
            return acc;
          }, {});
          setTypeData(dictionary);
        } else {
          console.error("Error fetching types:", res.data);
        }
      } catch (error) {
        console.error("Error fetching types:", error);
      }
    };
    fetchTypes();
  }, []);

  useEffect(() => {
    const fetchMaxOrder = async () => {
      try {
        const result = await api.get(`/admin/course/${courseId}/${weekId}/maxorder`);
        if (result.data.success) {
          const currentOrder = result.data.maxOrder;
          setOrderId(currentOrder + 1);
        } else {
          console.error("Error fetching Max order", result.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchMaxOrder();
  }, [courseId, weekId]);

  // NEW: Handle file changes
  const handleFileChange = (e) => {
    setDocumentFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (typeId === "3" && !selectedQuiz) {
      enqueueSnackbar("Please select a quiz before submitting.", { variant: "error" });
      return;
    }

    // Use FormData to send file + other fields
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("courseId", courseId);
    formData.append("weekId", weekId);
    formData.append("orderId", orderId);
    formData.append("typeId", typeId);

    // If it's a quiz, include the quiz ID
    if (typeId === "3" && selectedQuiz) {
      formData.append("quizId", selectedQuiz.id);
    }

    // If type is Document (assuming typeId == "2" means Document),
    // we append the file itself. Otherwise, we append the URL.
    if (typeId === "2") {
      if (!documentFile) {
        enqueueSnackbar("Please choose a document file.", { variant: "error" });
        return;
      }
      formData.append("document", documentFile);
    } else {
      formData.append("contentUrl", contentUrl);
    }

    try {
      // Post to your new or existing "upload-section" route that uses multer
      const res = await api.post("/admin/upload-section", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200) {
        enqueueSnackbar("Section created successfully!", { variant: "success" });
        navigate(`/admin/course/${courseId}`);
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Failed to create section.", { variant: "error" });
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen p-6 text-gray-300">
      <h1 className="text-2xl font-bold mb-6">Create Section</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title:
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description:
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            required
          />
        </div>

        {/* Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium mb-1">
            Type:
          </label>
          <select
            id="type"
            value={typeId || ""}
            onChange={(e) => setTypeId(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="" disabled>
              Select Type
            </option>
            {Object.entries(typeData).map(([id, type]) => (
              <option key={id} value={id} className="bg-gray-800">
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* If it's a quiz */}
        {isQuiz ? (
          <div>
            <label htmlFor="quiz" className="block text-sm font-medium mb-1">
              Select a Quiz:
            </label>
            <select
              id="quiz"
              value={selectedQuiz?.id || ""}
              onChange={(e) => handleChooseQuiz(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="" disabled>
                Select a quiz
              </option>
              {quizzes.map((quiz) => (
                <option key={quiz.id} value={quiz.id}>
                  {quiz.title}
                </option>
              ))}
            </select>
          </div>
        ) : typeId === "2" ? (
          // If it's a Document
          <div>
            <label htmlFor="document" className="block text-sm font-medium mb-1">
              Upload Document:
            </label>
            <input
              id="document"
              type="file"
              onChange={handleFileChange}
              className="text-sm text-gray-400"
            />
          </div>
        ) : (
          // Otherwise, content URL
          <div>
            <label htmlFor="contentUrl" className="block text-sm font-medium mb-1">
              Content URL:
            </label>
            <input
              id="contentUrl"
              type="text"
              value={contentUrl}
              onChange={(e) => setContentUrl(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        )}

        {/* Selected Quiz Details */}
        {selectedQuiz && (
          <div className="mt-4 p-4 bg-gray-800 border border-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold text-teal-300">{selectedQuiz.title}</h3>
            <p className="text-sm text-gray-400">{selectedQuiz.description}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateSection;
