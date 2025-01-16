const QuizModel = require("../models/QuizModel");

const QuizController = {
  createQuiz: async (req, res) => {
    try {
      const { title, description, open_time,  time_limit_minutes, review_available_time, questions } = req.body;

      // Create quiz
      const quizId = await QuizModel.createQuiz({
        title,
        description,
        open_time,
        
        time_limit_minutes,
        review_available_time,
      });

      // Add questions
      for (const question of questions) {
        const questionId = await QuizModel.addQuestion(quizId, question);

        // If the question is MCQ, add options
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
      const { quiz_id, responses } = req.body;
      const { nic } = req.user;
      const student_nic = nic;
      let allAutoGraded=true;
      let totalMarks = 0;

      for (const response of responses) {
        const { question_id, response_text, uploaded_file_url } = response;
        

        // Save response
        const isAutoGraded = response_text ? 1 : 0; // MCQs are auto-graded
        const grade = isAutoGraded ? await QuizModel.autoGrade(question_id, response_text) : null;

        if (!isAutoGraded) {
          allAutoGraded = false;
        }
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
      await QuizModel.saveQuizResult({ quiz_id, student_nic, total_marks: totalMarks,graded: allAutoGraded ? 1 : 0 });

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
        return res.status(600).json({
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

   getQuizInfoById : async (req, res) => {
    try {
      const { quizId } = req.params;
      const { nic } = req.user;
  
      // Check if user has already responded to the quiz
      const hasResponded = await QuizModel.checkUserResponse(quizId, nic);
  
      // Fetch quiz info
      const quizInfo = await QuizModel.getQuizInfoById(quizId);
  
      if (!quizInfo) {
        return res.status(404).json({ success: false, message: "Quiz not found" });
      }
  
      // Respond with quiz info and the response flag
      res.status(200).json({
        success: true,
        quizInfo,
        hasResponded, // Send this flag to the frontend
      });
    } catch (error) {
      console.error("Error fetching quiz info:", error.message);
      res.status(500).json({ success: false, message: "Failed to fetch quiz info" });
    }
  },
  getAllQuizes:async(req,res)=>{
    try {
      const quizzes=await QuizModel.getAllQuizes();
      
      res.status(200).json( {quizzes:quizzes,success:true});
    } catch (error) {
      console.error(error);
    res.status(500).json({ error: 'Failed to fetch quizzes',success:false });
    }
  },


  getStudentQuizzes: async (req, res) => {
    const { nic, courseId } = req.params;

    try {
      // Fetch all quizzes for the course
      const quizzes = await QuizModel.getQuizzesByCourse(courseId);
      
      // Fetch student quiz results
      const studentResults = await QuizModel.getStudentQuizResults(nic, courseId);

      // Map quizzes to include student-specific data
      const quizzesWithStudentData = quizzes.map((quiz) => {
        const studentResult = studentResults.find((result) => result.quiz_id === quiz.id);

        return {
          ...quiz,
          attempted: !!studentResult,
          marks: studentResult ? studentResult.total_marks : null,
          graded: studentResult ? studentResult.graded : null,
        };
      });

      res.status(200).json({ success: true, quizzes: quizzesWithStudentData });
    } catch (error) {
      console.error('Error fetching quizzes:', error.message);
      res.status(500).json({ success: false, message: 'Failed to fetch quizzes for the student.' });
    }
  },

  getStudentUploadedFiles: async (req, res) => {
    const { nic, courseId, quizId } = req.params;

    try {
      // Fetch uploaded files for the student and quiz
      const uploadedFiles = await QuizModel.getUploadedFiles(nic, courseId, quizId);

      if (!uploadedFiles || uploadedFiles.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No files found for the specified student, course, and quiz.',
        });
      }

      res.status(200).json({
        success: true,
        files: uploadedFiles,
      });
    } catch (error) {
      console.error('Error fetching uploaded files:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch uploaded files.',
      });

    }
  },
  getQuizResult:async(req,res)=>{
    try {
      const quizId=req.params;
      const rows=QuizModel.getResultOfQuiz(quizId)
      return res.status(200).json({results:rows,success:true})
    } catch (error) {
      res.status(500).json({error:"Failed to fetch quiz results",success:false})
    }
  }
  
};

module.exports = QuizController;
