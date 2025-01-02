import React, { useState } from "react";

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
    question_image: null, // For storing the image file
    question_type: "mcq",
    options: [],
    correct_answer: "",
  });

  const [currentOption, setCurrentOption] = useState("");

  const handleInputChange = (e) => {
    setQuiz({ ...quiz, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "question_image") {
      setCurrentQuestion({ ...currentQuestion, question_image: files[0] });
    } else {
      setCurrentQuestion({ ...currentQuestion, [name]: value });
    }
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
      question_image: null,
      question_type: "mcq",
      options: [],
      correct_answer: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", quiz.title);
    formData.append("description", quiz.description);
    formData.append("open_time", quiz.open_time);
    formData.append("close_time", quiz.close_time);
    formData.append("time_limit_minutes", quiz.time_limit_minutes);
    formData.append("review_available_time", quiz.review_available_time);
    formData.append("questions", JSON.stringify(quiz.questions.map((q) => ({
      ...q,
      image: q.question_image ? URL.createObjectURL(q.question_image) : null,
    }))));

    try {
      const accessToken = sessionStorage.getItem("accessToken");

      const response = await fetch("http://localhost:3000/admin/create-quiz", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const data = await response.json();
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
          placeholder="Open Time"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="datetime-local"
          name="close_time"
          value={quiz.close_time}
          onChange={handleInputChange}
          placeholder="Close Time"
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
          placeholder="Review Availability Time"
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
        <input
          type="file"
          name="question_image"
          onChange={handleQuestionChange}
          accept="image/*"
          className="w-full p-2 border rounded"
        />
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

        <button type="submit" className="p-2 bg-blue-500 text-white rounded mt-4">
          Create Quiz
        </button>
      </form>
    </div>
  );
};

export default CreateQuiz;
