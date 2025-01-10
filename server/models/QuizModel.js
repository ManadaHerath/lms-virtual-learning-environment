const pool = require("../config/dbconfig");

const QuizModel = {
  createQuiz: async (quizData) => {
    const { title, description, open_time, time_limit_minutes, review_available_time } = quizData;
    const query = `
      INSERT INTO Quiz (title, description, open_time, time_limit_minutes, review_available_time)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [title, description, open_time, time_limit_minutes, review_available_time]);
    return result.insertId;
  },

  addQuestion: async (quizId, questionData) => {
    const {
        question_text,
        question_image_url,
        question_type,
        options
    } = questionData;

    // Determine the correct_answer from options
    const correctOption = options.find(option => option.is_correct); // Find the correct option
    const correct_answer = correctOption ? correctOption.option_text : null; // Extract the text or set null

    

    const query = `
      INSERT INTO Question (quiz_id, question_text, question_image_url, question_type, correct_answer)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [
        quizId,
        question_text,
        question_image_url,
        question_type,
        correct_answer,
    ]);
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
},
 getAllQuizes:async()=>{
  const query=`select id,title,description from Quiz`;
  const [rows]=await pool.query(query);
 
  return rows;
 },

 getQuizzesByCourse: async (courseId) => {
  const query = `
    SELECT q.id, q.title, q.description, q.open_time, q.close_time, q.time_limit_minutes
    FROM Quiz q
    JOIN Section s ON q.id = s.quiz_id
    WHERE s.course_id = ?
  `;
  const [quizzes] = await pool.execute(query, [courseId]);
  return quizzes;
},

// Get quiz results for a specific student under a course
getStudentQuizResults: async (nic, courseId) => {
  const query = `
    SELECT qr.quiz_id, qr.total_marks, qr.graded
    FROM QuizResult qr
    JOIN Section s ON qr.quiz_id = s.quiz_id
    WHERE qr.student_nic = ? AND s.course_id = ?
  `;
  const [results] = await pool.execute(query, [nic, courseId]);
  return results;
},

getUploadedFiles: async (nic, courseId, quizId) => {
  const query = `
    SELECT sr.id AS response_id, sr.uploaded_file_url
    FROM StudentResponse sr
    JOIN Question q ON sr.question_id = q.id
    JOIN Quiz qu ON q.quiz_id = qu.id
    JOIN Section s ON qu.id = s.quiz_id
    WHERE sr.student_nic = ? AND s.course_id = ? AND qu.id = ?
  `;
  const [files] = await pool.execute(query, [nic, courseId, quizId]);
  return files;
}
  
};

module.exports = QuizModel;
