const pool = require("../config/dbconfig");

const UserModel = {
  // Find user by email
  findByEmail: async (email) => {
    const query = "select userLogin(?);";
    try {
      const [result] = await pool.query(query, [email]);
     
      const dynamicKey = Object.keys(result[0])[0]; 

      // Access the value of the dynamic key, which is an object
      const { data, success } = result[0][dynamicKey]; // Destructure to extract data and success

      return { data, success }; // Return the JSON object
      // const key = Object.keys(result[0])[0]; // Get the dynamic key
      // const userLoginResult = JSON.parse(result[0][key]); // Parse the JSON string
      
       // Return the first user found (or null if not found)
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

   

    // Check if email already exists
    const existingUser = await UserModel.findByEmail(email);
    console.log(existingUser);
    if (existingUser) {
      throw new Error("Email already registered");
      
    }

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction(); // Start transaction

      // Insert into Address table
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

      // Insert into User table
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

      await connection.commit(); // Commit transaction
      return userResult;
    } catch (error) {
      await connection.rollback(); // Rollback transaction on error
      throw error;
    } finally {
      connection.release(); // Release the connection
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
  

  // Fetch course details by ID
  getCourseById: async (courseId) => {
    const query = "SELECT course_id, course_type, batch, description, price, image_url FROM Course WHERE course_id = ?;";
    try {
      const [course] = await pool.query(query, [courseId]);
      return course[0];
    } catch (err) {
      throw err;
    }
  },

};

module.exports = UserModel;
