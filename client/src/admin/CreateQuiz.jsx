import React, { useState } from "react";
import api from "../redux/api";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { useSnackbar } from "notistack";

const CreateQuiz = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [quiz, setQuiz] = useState({
    title: "",
    description: "",
    open_time: "",
    close_time: "",
    time_limit_minutes: "",
    review_available_time: "",
    questions: [],
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    question_text: "",
    question_image_url: "",
    question_type: "mcq",
    options: [],
    correct_answer: "",
  });

  const [currentOption, setCurrentOption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null); // Track which question is being edited

  const handleInputChange = (e) => {
    setQuiz({ ...quiz, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (e) => {
    setCurrentQuestion({ ...currentQuestion, [e.target.name]: e.target.value });
  };

  const addOption = () => {
    if (currentOption) {
      setCurrentQuestion({
        ...currentQuestion,
        options: [
          ...currentQuestion.options,
          { option_text: currentOption, is_correct: false },
        ],
      });
      setCurrentOption("");
    }
  };

  const markCorrectOption = (index) => {
    const updatedOptions = currentQuestion.options.map((option, i) => ({
      ...option,
      is_correct: i === index,
    }));
    setCurrentQuestion({ ...currentQuestion, options: updatedOptions });
  };

  const addQuestion = () => {
    if (editingIndex !== null) {
      // Edit existing question
      const updatedQuestions = [...quiz.questions];
      updatedQuestions[editingIndex] = currentQuestion;
      setQuiz({ ...quiz, questions: updatedQuestions });
      setEditingIndex(null);
    } else {
      // Add new question
      setQuiz({ ...quiz, questions: [...quiz.questions, currentQuestion] });
    }

    // Clear current question
    setCurrentQuestion({
      question_text: "",
      question_image_url: "",
      question_type: "mcq",
      options: [],
      correct_answer: "",
    });
  };
  const handleEditQuestion = (index) => {
    setCurrentQuestion(quiz.questions[index]);
    setEditingIndex(index);
  };
  const handleDeleteQuestion = (index) => {
    const updatedQuestions = quiz.questions.filter((_, i) => i !== index);
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleImageUpload = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "my_first_upload"); // Replace with your Cloudinary upload preset
    formData.append("cloud_name", "dxxa198zw"); // Replace with your Cloudinary cloud name

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dxxa198zw/image/upload",
        formData
      );
      const imageUrl = response.data.secure_url;
      setCurrentQuestion({ ...currentQuestion, question_image_url: imageUrl });
  
      enqueueSnackbar("Image uploaded successfully", { variant: "success" })
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar("Failed to upload image. Please try again.", { variant: "error" })
      
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      handleImageUpload(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await api.post("/admin/create-quiz", quiz);
      const data = await response.data;
      if (data.success) {
        
        enqueueSnackbar("Quiz created successfully!", { variant: "success" })
        setQuiz({
          title: "",
          description: "",
          open_time: "",
          close_time: "",
          time_limit_minutes: "",
          review_available_time: "",
          questions: [],
        });
      } else {
        enqueueSnackbar(data.message || "Failed to create quiz.", { variant: "error" })
        
      }
    } catch (error) {
      console.error(error.message);
      
      enqueueSnackbar("An error occurred. Please try again.", { variant: "error" })
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen p-6 text-gray-300">
      <h1 className="text-2xl font-bold mb-6">Create Quiz</h1>
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
        <h2 className="text-xl font-bold mt-6">Added Questions</h2>
        <div className="space-y-4">
          {quiz.questions.map((question, index) => (
            <div
              key={index}
              className="p-4 bg-gray-800 rounded-lg border border-gray-700 space-y-2"
            >
              <p className="text-sm font-medium">{question.question_text}</p>
              {question.question_image_url ? <img
            src={question.question_image_url}
            alt="question"
            className="w-16 h-16  object-cover mt-2 rounded-lg"
          /> :<></>}
              {question.options.length > 0 && (
                <ul className="list-disc pl-6 text-gray-400">
                  {question.options.map((option, i) => (
                    <li key={i}>
                      {option.option_text}{" "}
                      {option.is_correct && (
                        <span className="text-green-400">(Correct)</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => handleEditQuestion(index)}
                  className="text-blue-400 hover:underline"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(index)}
                  className="text-red-400 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>


        <h2 className="text-xl font-bold mt-6">Add Questions</h2>
        <div>
          <label htmlFor="question_text" className="block text-sm font-medium mb-1">Question Text:</label>
          <textarea
            name="question_text"
            value={currentQuestion.question_text}
            onChange={handleQuestionChange}
            placeholder="Question Text"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
          />
        </div>
        <div {...getRootProps()} className="border border-gray-700 p-4 text-center rounded-lg cursor-pointer hover:bg-gray-800/50 transition-colors">
          <input {...getInputProps()} />
          <p className="text-gray-400">
            {uploading
              ? "Uploading..."
              : "Drag 'n' drop an image here, or click to select an image"}
          </p>
        </div>
        {currentQuestion.question_image_url && (
          <img
            src={currentQuestion.question_image_url}
            alt="Uploaded"
            className="w-32 h-32 object-cover mt-2 rounded-lg"
          />
        )}
        <div>
          <label htmlFor="question_type" className="block text-sm font-medium mb-1">Question Type:</label>
          <select
            name="question_type"
            value={currentQuestion.question_type}
            onChange={handleQuestionChange}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="mcq">MCQ</option>
            <option value="essay">Essay</option>
          </select>
        </div>
        {currentQuestion.question_type === "mcq" && (
          <>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={currentOption}
                onChange={(e) => setCurrentOption(e.target.value)}
                placeholder="Option Text"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={addOption}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add Option
              </button>
            </div>
            <div className="mt-2 space-y-2">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg"
                >
                  <span className="text-gray-300">{option.option_text}</span>
                  <button
                    type="button"
                    onClick={() => markCorrectOption(index)}
                    className={`px-3 py-1 rounded-lg ${
                      option.is_correct
                        ? "bg-green-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    } transition-colors`}
                  >
                    {option.is_correct ? "Correct" : "Mark as Correct"}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
        <button
          type="button"
          onClick={addQuestion}
          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Add Question
        </button>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Create Quiz
        </button>
      </form>
    </div>
  );
};

export default CreateQuiz;