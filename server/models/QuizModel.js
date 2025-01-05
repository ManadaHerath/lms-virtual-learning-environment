const pool = require("../config/dbconfig");

const QuizModel = {
  createQuiz: async (quizData) => {
    const { title, description, open_time, close_time, time_limit_minutes, review_available_time } = quizData;
    const query = `
      INSERT INTO Quiz (title, description, open_time, close_time, time_limit_minutes, review_available_time)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [title, description, open_time, close_time, time_limit_minutes, review_available_time]);
    return result.insertId;
  },

  addQuestion: async (quizId, questionData) => {
    const { question_text, question_image_url, question_type, correct_answer } = questionData;
    const query = `
      INSERT INTO Question (quiz_id, question_text, question_image_url, question_type, correct_answer)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [quizId, question_text, question_image_url, question_type, correct_answer]);
    return result.insertId;
  },

  addMCQOption: async (questionId, optionData) => {
    const { option_text, is_correct } = optionData;
    const query = `
      INSERT INTO MCQOption (question_id, option_text, is_correct)
      VALUES (?, ?, ?)
    `;
    await pool.query(query, [questionId, option_text, is_correct]);
  },

  autoGrade: async (questionId, responseText) => {
    const query = `
      SELECT correct_answer FROM Question WHERE id = ?
    `;
    const [rows] = await pool.query(query, [questionId]);
    return rows[0]?.correct_answer === responseText ? 1 : 0; // Assign 1 mark for correct answer
  },

  saveResponse: async (responseData) => {
    const { student_nic, question_id, response_text, uploaded_file_url, is_auto_graded, grade } = responseData;
    const query = `
      INSERT INTO StudentResponse (student_nic, question_id, response_text, uploaded_file_url, is_auto_graded, grade)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await pool.query(query, [student_nic, question_id, response_text, uploaded_file_url, is_auto_graded, grade]);
  },

  saveQuizResult: async (resultData) => {
    const { quiz_id, student_nic, total_marks } = resultData;
    const query = `
      INSERT INTO QuizResult (quiz_id, student_nic, total_marks)
      VALUES (?, ?, ?)
    `;
    await pool.query(query, [quiz_id, student_nic, total_marks]);
  },

  getQuizById: async (quizId) => {
    const query = "SELECT * FROM Quiz WHERE id = ?";
    const [rows] = await pool.query(query, [quizId]);
    return rows[0];
  },

  getQuestionsByQuizId: async (quizId) => {
    const query = "SELECT * FROM Question WHERE quiz_id = ?";
    const [rows] = await pool.query(query, [quizId]);
    return rows;
  },

  getOptionsByQuestionId: async (questionId) => {
    const query = `
      SELECT id, option_text
      FROM MCQOption
      WHERE question_id = ?
    `;
    const [rows] = await pool.query(query, [questionId]);
    return rows;
  },  

  getResponsesByStudentAndQuiz: async (studentNic, quizId) => {
    const query = `
      SELECT sr.* 
      FROM StudentResponse sr
      JOIN Question q ON sr.question_id = q.id
      WHERE q.quiz_id = ? AND sr.student_nic = ?
    `;
    const [rows] = await pool.query(query, [quizId, studentNic]);
    return rows;
  },

  getQuizInfoById: async (quizId) => {
    const query = `
      SELECT title, description, open_time, close_time, time_limit_minutes
      FROM Quiz
      WHERE id = ?
    `;
    const [rows] = await pool.query(query, [quizId]);
    return rows[0];
  },

  // Update your existing model to add the method to check if a user has responded to the quiz
 checkUserResponse : async (quizId, nic) => {
  const query = `
    select * from QuizResult where student_nic = ? and quiz_id = ?;
  `;
  const [rows] = await pool.query(query, [nic, quizId]);
  return rows.length > 0;
}

  
};

module.exports = QuizModel;
