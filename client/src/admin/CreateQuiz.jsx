import React, { useState } from "react";
import api from "../redux/api";
import axios from "axios";
import { useDropzone } from "react-dropzone";

const CreateQuiz = () => {
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
    setQuiz({ ...quiz, questions: [...quiz.questions, currentQuestion] });
    setCurrentQuestion({
      question_text: "",
      question_image_url: "",
      question_type: "mcq",
      options: [],
      correct_answer: "",
    });
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
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error(error.message);
      alert("Failed to upload image. Please try again.");
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
        alert("Quiz created successfully!");
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
        alert(data.message || "Failed to create quiz.");
      }
    } catch (error) {
      console.error(error.message);
      alert("An error occurred. Please try again.");
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
          <label htmlFor="close_time" className="block text-sm font-medium mb-1">Close Time:</label>
          <input
            type="datetime-local"
            name="close_time"
            value={quiz.close_time}
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