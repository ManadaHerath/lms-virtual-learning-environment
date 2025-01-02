const QuizModel = require("../models/QuizModel");
const cloudinary = require("../config/cloudinary");

const QuizController = {
  createQuiz: async (req, res) => {
    try {
      const { title, description, open_time, close_time, time_limit_minutes, review_available_time } = req.body;
      const questions = JSON.parse(req.body.questions); // Parse questions from stringified JSON
      const quizId = await QuizModel.createQuiz({
        title,
        description,
        open_time,
        close_time,
        time_limit_minutes,
        review_available_time,
      });

      for (const question of questions) {
        let questionImageUrl = null;

        // Upload image to Cloudinary if provided
        if (question.image) {
          const uploadResult = await cloudinary.uploader.upload(question.image, {
            folder: "quiz_images",
          });
          questionImageUrl = uploadResult.secure_url;
        }

        const questionId = await QuizModel.addQuestion(quizId, {
          ...question,
          question_image_url: questionImageUrl,
        });

        if (question.question_type === "mcq" && question.options) {
          for (const option of question.options) {
            await QuizModel.addMCQOption(questionId, option);
          }
        }
      }

      res.status(201).json({ success: true, message: "Quiz created successfully", quizId });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, message: "Failed to create quiz" });
    }
  },

  submitQuiz: async (req, res) => {
    try {
      const { quiz_id, student_nic, responses } = req.body;

      let totalMarks = 0;

      for (const response of responses) {
        const { question_id, response_text, uploaded_file_url } = response;

        // Save response
        const isAutoGraded = response_text ? 1 : 0; // MCQs are auto-graded
        const grade = isAutoGraded ? await QuizModel.autoGrade(question_id, response_text) : null;

        if (grade) totalMarks += grade;

        await QuizModel.saveResponse({
          student_nic,
          question_id,
          response_text,
          uploaded_file_url,
          is_auto_graded: isAutoGraded,
          grade,
        });
      }

      // Save quiz result
      await QuizModel.saveQuizResult({ quiz_id, student_nic, total_marks: totalMarks });

      res.status(200).json({ success: true, message: "Quiz submitted successfully", totalMarks });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, message: "Failed to submit quiz" });
    }
  },

  getQuizDetails: async (req, res) => {
    try {
      const { quizId } = req.params;

      // Fetch quiz details
      const quiz = await QuizModel.getQuizById(quizId);

      if (!quiz) {
        return res.status(404).json({ success: false, message: "Quiz not found" });
      }

      // Fetch questions for the quiz
      const questions = await QuizModel.getQuestionsByQuizId(quizId);

      // Attach options to MCQ questions, excluding "is_correct"
      for (const question of questions) {
        if (question.question_type === "mcq") {
          const options = await QuizModel.getOptionsByQuestionId(question.id);
          question.options = options.map((option) => ({
            id: option.id,
            option_text: option.option_text,
          }));
        }
        // Remove "correct_answer" from the question
        delete question.correct_answer;
      }

      quiz.questions = questions;

      res.status(200).json({ success: true, quiz });
    } catch (error) {
      console.error("Error fetching quiz details:", error.message);
      res.status(500).json({ success: false, message: "Failed to fetch quiz details" });
    }
  },

  getQuizReview: async (req, res) => {
    try {
      const { quizId } = req.params;
      const { nic } = req.user; // Get the student NIC from the token

      // Fetch quiz details
      const quiz = await QuizModel.getQuizById(quizId);

      if (!quiz) {
        return res.status(404).json({ success: false, message: "Quiz not found" });
      }

      // Ensure review availability time has passed
      if (quiz.review_available_time && new Date() < new Date(quiz.review_available_time)) {
        return res.status(403).json({
          success: false,
          message: "Review is not available yet",
        });
      }

      // Fetch questions
      const questions = await QuizModel.getQuestionsByQuizId(quizId);

      // Fetch student responses
      const responses = await QuizModel.getResponsesByStudentAndQuiz(nic, quizId);

      // Combine questions with student responses and correct answers
      const review = questions.map((question) => {
        const response = responses.find((r) => r.question_id === question.id) || {};
        return {
          ...question,
          student_response: response.response_text || response.uploaded_file_url || null,
          student_grade: response.grade || null,
        };
      });

      res.status(200).json({ success: true, review });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, message: "Failed to fetch quiz review" });
    }
  },

  getQuizInfoById: async (req, res) => {
    try {
      const { quizId } = req.params;

      // Fetch quiz info from the database
      const quizInfo = await QuizModel.getQuizInfoById(quizId);

      if (!quizInfo) {
        return res.status(404).json({ success: false, message: "Quiz not found" });
      }

      res.status(200).json({ success: true, quizInfo });
    } catch (error) {
      console.error("Error fetching quiz info:", error.message);
      res.status(500).json({ success: false, message: "Failed to fetch quiz info" });
    }
  }
};

module.exports = QuizController;
