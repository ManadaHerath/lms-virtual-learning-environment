const pool = require("../config/dbconfig");

const AdminModel = {
  // Find user by email
  findByEmail: async (email) => {
    const query = "select adminLogin(?);";
    try {
      const [result] = await pool.query(query, [email]);
      const dynamicKey = Object.keys(result[0])[0];

      // Access the value of the dynamic key, which is an object
      const { data, success } = result[0][dynamicKey];

      return { data, success };
    } catch (err) {
      throw err;
    }
  },

  createAdmin: async (adminData) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const insertQuery = `
        INSERT INTO Admin (nic, first_name, last_name, email, password, telephone)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      await connection.execute(insertQuery, [
        adminData.nic,
        adminData.first_name,
        adminData.last_name,
        adminData.email,
        adminData.password,
        adminData.telephone,
      ]);

      const [result] = await connection.execute(`SELECT adminLogin(?)`, [
        adminData.email,
      ]);
      const dynamicKey = Object.keys(result[0])[0];

      const { data, success } = result[0][dynamicKey];

      if (!success) {
        throw new Error("Admin verification failed");
      }

      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      console.error("Transaction failed:", error.message);
      throw error;
    } finally {
      await connection.release();
    }
  },

  createCourse: async (courseData) => {
    const {
      course_type,
      batch,
      month,
      description,
      image_url,
      price,
      duration,
      progress,
      started_at,
      ended_at,
    } = courseData;

    try {
      const [result] = await pool.query(
        `INSERT INTO Course (course_type, batch, month, description, image_url, price, duration, progress, started_at, ended_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          course_type,
          batch,
          month,
          description,
          image_url,
          price,
          duration,
          progress,
          started_at,
          ended_at,
        ]
      );

      return result.insertId;
    } catch (err) {
      throw err;
    }
  },

  // Student Management Models
  // Get all students
  getStudents: async () => {
    try {
      const [students] = await pool.query("SELECT * FROM User");
      return students;
    } catch (error) {
      throw error;
    }
  },

  // Get student by ID
  getStudentById: async (id) => {
    try {
      const [student] = await pool.query("SELECT * FROM User WHERE nic = ?", [
        id,
      ]);
      return student;
    } catch (error) {
      throw error;
    }
  },

  // Update student status by ID
  updateStudentStatus: async (id, status) => {
    try {
      const [result] = await pool.query(
        "UPDATE User SET status = ? WHERE nic = ?",
        [status, id]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Get enrolled students by course ID
  getEnrolledStudents: async (courseId, paid) => {
    try {
      const [students] = await pool.query(
        `SELECT * FROM User
         WHERE nic IN (SELECT user_id FROM Enrollment WHERE course_id = ?)`,
        [courseId]
      );
      return students;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = AdminModel;
