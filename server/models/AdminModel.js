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
};

module.exports = AdminModel;
