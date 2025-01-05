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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create Quiz</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={quiz.title}
          onChange={handleInputChange}
          placeholder="Quiz Title"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="description"
          value={quiz.description}
          onChange={handleInputChange}
          placeholder="Quiz Description"
          className="w-full p-2 border rounded"
        />
        <input
          type="datetime-local"
          name="open_time"
          value={quiz.open_time}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="datetime-local"
          name="close_time"
          value={quiz.close_time}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="time_limit_minutes"
          value={quiz.time_limit_minutes}
          onChange={handleInputChange}
          placeholder="Time Limit (Minutes)"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="datetime-local"
          name="review_available_time"
          value={quiz.review_available_time}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />

        <h2 className="text-xl font-bold mt-6">Add Questions</h2>
        <textarea
          name="question_text"
          value={currentQuestion.question_text}
          onChange={handleQuestionChange}
          placeholder="Question Text"
          className="w-full p-2 border rounded"
        />
        <div {...getRootProps()} className="border p-4 text-center">
          <input {...getInputProps()} />
          <p>
            {uploading
              ? "Uploading..."
              : "Drag 'n' drop an image here, or click to select an image"}
          </p>
        </div>
        {currentQuestion.question_image_url && (
          <img
            src={currentQuestion.question_image_url}
            alt="Uploaded"
            className="w-32 h-32 object-cover mt-2"
          />
        )}
        <select
          name="question_type"
          value={currentQuestion.question_type}
          onChange={handleQuestionChange}
          className="w-full p-2 border rounded"
        >
          <option value="mcq">MCQ</option>
          <option value="essay">Essay</option>
        </select>
        {currentQuestion.question_type === "mcq" && (
          <>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={currentOption}
                onChange={(e) => setCurrentOption(e.target.value)}
                placeholder="Option Text"
                className="w-full p-2 border rounded"
              />
              <button
                type="button"
                onClick={addOption}
                className="p-2 bg-blue-500 text-white rounded"
              >
                Add Option
              </button>
            </div>
            <div className="mt-2">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between space-x-4"
                >
                  <span>{option.option_text}</span>
                  <button
                    type="button"
                    onClick={() => markCorrectOption(index)}
                    className={`p-1 ${
                      option.is_correct
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-black"
                    } rounded`}
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
          className="p-2 bg-green-500 text-white rounded mt-4"
        >
          Add Question
        </button>

        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded mt-4"
        >
          Create Quiz
        </button>
      </form>
    </div>
  );
};

export default CreateQuiz;
