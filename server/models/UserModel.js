const pool = require("../config/dbconfig");

const UserModel = {
  // Find user by email
  findByEmail: async (email) => {
    const query = "select userLogin(?);";
    try {
      const [result] = await pool.query(query, [email]);
      const dynamicKey = Object.keys(result[0])[0]; 

      const { data, success } = result[0][dynamicKey]; 
      return { data, success };
    } catch (err) {
      throw err;
    }
  },

  // Create a new user
  create: async (userData) => {
    const {
      nic,
      first_name,
      last_name,
      email,
      password,
      telephone,
      street_address,
      city,
      province,
      postal_code,
      country,
      date_of_birth,
      batch,
      status,
      image_url,
    } = userData;

    const existingUser = await UserModel.findByEmail(email);
    console.log(existingUser);
    if (existingUser) {
      throw new Error("Email already registered");
    }

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction(); 

      const addressSql = `
        INSERT INTO Address (street_address, city, province, postal_code, country)
        VALUES (?, ?, ?, ?, ?)
      `;
      const [addressResult] = await connection.query(addressSql, [
        street_address,
        city,
        province,
        postal_code,
        country,
      ]);
      const address_id = addressResult.insertId;

      const userSql = `
        INSERT INTO User (nic, first_name, last_name, address_id, telephone, email, password, date_of_birth, batch, image_url, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const [userResult] = await connection.query(userSql, [
        nic,
        first_name,
        last_name,
        address_id,
        telephone,
        email,
        password,
        date_of_birth,
        batch,
        image_url,
        status,
      ]);

      await connection.commit(); 
      return userResult;
    } catch (error) {
      await connection.rollback(); 
      throw error;
    } finally {
      connection.release(); 
    }
  },

  getAllCourses: async (batch, type) => {
    let query = "SELECT course_id,price, CONCAT(course_type, ' ', batch) AS name, image_url FROM Course";
    const queryParams = [];
  
    if (batch || type) {
      query += " WHERE";
      if (batch) {
        query += " batch = ?";
        queryParams.push(batch);
      }
      if (type) {
        if (queryParams.length) query += " AND";
        query += " course_type = ?";
        queryParams.push(type);
      }
    }
  
    try {
      const [courses] = await pool.query(query, queryParams);
      return courses;
    } catch (err) {
      throw err;
    }
  },

  getCourseById: async (courseId) => {
    const query = "SELECT course_id, course_type, batch, description, price, image_url FROM Course WHERE course_id = ?;";
    try {
      const [course] = await pool.query(query, [courseId]);
      return course[0];
    } catch (err) {
      throw err;
    }
  },

  getEnrolledCoursesByNIC: async (nic) => {
    const query = `
      SELECT 
        c.course_id,
        c.course_type,
        c.batch,
        c.month,
        c.image_url,
        c.description,
        c.price,
        c.duration,
        c.started_at,
        c.ended_at
      FROM Enrollment e
      INNER JOIN Course c ON e.course_id = c.course_id
      WHERE e.nic = ?
    `;

    try {
      const [rows] = await pool.query(query, [nic]);
      if (rows.length === 0) {
        return { success: false, message: "No enrolled courses found" };
      }
      return { success: true, data: rows };
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
      return { success: false, message: "Database query failed" };
    }
  },
};

module.exports = UserModel;
