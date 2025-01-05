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
      
      date_of_birth,
      batch,
      
      image_url,
    } = userData;

   

    // Check if email already exists
   

    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction(); // Start transaction

      // Insert into Address table
      const addressSql = `
        INSERT INTO Address (street_address, city, province, postal_code)
        VALUES (?, ?, ?, ?)
      `;
      const [addressResult] = await connection.query(addressSql, [
        street_address,
        city,
        province,
        postal_code,
        
      ]);
      const address_id = addressResult.insertId;

      // Insert into User table
      const userSql = `
        INSERT INTO User (nic, first_name, last_name, address_id, telephone, email, password, date_of_birth, batch, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
  userGetAllCourses: async (batch, type) => {
    let query = "SELECT course_id,price, CONCAT(course_type, ' ', batch) AS name, image_url FROM Course where started_at <= CURDATE() and ended_at >= CURDATE() ";
    const queryParams = [];
  
    if (batch || type) {
      
      if (batch) {
        query += "AND batch = ?";
        queryParams.push(batch);
      }
      if (type) {
        
        query += "AND course_type = ?";
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

  getUserProfile: async (nic) => {
    const query = `
      SELECT 
        u.nic, u.first_name, u.last_name, u.email, u.telephone, u.date_of_birth, 
        u.batch, u.image_url, u.status,
        a.street_address, a.city, a.province, a.postal_code
      FROM User u
      LEFT JOIN Address a ON u.address_id = a.address_id
      WHERE u.nic = ?
    `;

    try {
      const [rows] = await pool.query(query, [nic]);
      return rows.length ? rows[0] : null; // Return the first row or null if not found
    } catch (err) {
      throw err;
    }
  },

  updateUserProfile: async (nic, updatedData) => {
    const {
      first_name,
      last_name,
      email,
      telephone,
      street_address,
      city,
      province,
      postal_code,
      
    } = updatedData;

    try {
      // Start transaction
      const connection = await pool.getConnection();
      await connection.beginTransaction();

      // Update Address table
      const updateAddressQuery = `
        UPDATE Address
        SET street_address = ?, city = ?, province = ?, postal_code = ?
        WHERE address_id = (SELECT address_id FROM User WHERE nic = ?)
      `;
      await connection.query(updateAddressQuery, [
        street_address,
        city,
        province,
        postal_code,
        
        nic,
      ]);

      // Update User table
      const updateUserQuery = `
        UPDATE User
        SET first_name = ?, last_name = ?, email = ?, telephone = ?
        WHERE nic = ?
      `;
      const [result] = await connection.query(updateUserQuery, [
        first_name,
        last_name,
        email,
        telephone,
        nic,
      ]);

      await connection.commit(); // Commit transaction
      return result.affectedRows > 0;
    } catch (err) {
      console.error(err.message);
      throw err;
    }
  },
  deleteUserProfile: async (nic) => {
    

    try {
      // Start transaction
      const connection = await pool.getConnection();
      await connection.beginTransaction();

     
      

      // Update User table
      const deleteUserQuery = `
        delete from User where nic = ?
      `;
      const [result] = await connection.query(deleteUserQuery, [
        
        nic
      ]);

      await connection.commit(); // Commit transaction
      return result.affectedRows > 0;
    } catch (err) {
      console.error(err.message);
      throw err;
    }
  },

  updateProfilePicture: async (nic, imageUrl) => {
    const query = `
      UPDATE User
      SET image_url = ?
      WHERE nic = ?
    `;
    try {
      const [result] = await pool.query(query, [imageUrl, nic]);
      return result.affectedRows > 0;
    } catch (err) {
      console.error(err.message);
      throw err;
    }
  },


  // Get all courses a user is enrolled in
  getEnrolledCourses: async (nic) => {
    
    const query = `
      SELECT c.course_id, c.price, CONCAT(c.course_type, ' ', c.batch) AS name, c.image_url
      FROM Course c
      JOIN Enrollment e ON c.course_id = e.course_id
      WHERE e.nic = ? and started_at <= CURDATE() and ended_at >= CURDATE()
    `;
    try {
      const [courses] = await pool.query(query, [nic]);
      
      return courses;
    } catch (err) {
      throw err;
    }
  },


  enrollCourse: async (nic, courseId) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction(); // Start transaction
  
      // Fetch the course fee (price) from the Course table
      const courseSql = `
        SELECT price FROM Course WHERE course_id = ?
      `;
      const [courseResult] = await connection.query(courseSql, [courseId]);
  
      if (courseResult.length === 0) {
        throw new Error("Course not found");
      }
  
      const courseFee = courseResult[0].price;
  
      // Insert into Enrollment table
      const enrollmentSql = `
        INSERT INTO Enrollment (nic, course_id)
        VALUES (?, ?)
      `;
      const [enrollmentResult] = await connection.query(enrollmentSql, [nic, courseId]);
      const enrollment_id = enrollmentResult.insertId;
  
      // Insert into Payment table with 'pending' status and the course fee as amount
     
  
      // Fetch all section IDs for the given course
      const sectionsSql = `
        SELECT id AS section_id 
        FROM Section 
        WHERE course_id = ?
      `;
      const [sections] = await connection.query(sectionsSql, [courseId]);
  
      if (sections.length > 0) {
        // Prepare the data for batch insertion into UserSection with mark_as_done = 0
        const userSectionData = sections.map((section) => [
          enrollment_id,
          section.section_id,
          0, // Mark as not done
        ]);
  
        // Insert into UserSection
        const userSectionSql = `
          INSERT INTO UserSection (enrollment_id, section_id, mark_as_done)
          VALUES ?
        `;
        await connection.query(userSectionSql, [userSectionData]);
      }
  
      await connection.commit(); // Commit transaction
      return enrollmentResult;
    } catch (error) {
      await connection.rollback(); // Rollback on error
      throw error;
    } finally {
      connection.release();
    }
  },
  

  // Check if user is already enrolled in the course
  checkEnrollment: async (nic, courseId) => {
    const query = `
      SELECT 1 FROM Enrollment
      WHERE nic = ? AND course_id = ?
    `;
    try {
      const [result] = await pool.query(query, [nic, courseId]);
      
      return result.length > 0; // Return true if the user is already enrolled
    } catch (err) {
      throw err;
    }
  },

  getPaymentHistory: async (nic) => {
    const query = `
      SELECT 
        p.payment_id,
        p.payment_type,
        p.amount,
        p.payment_date,
        c.course_type,
        c.batch,
        c.month
      FROM Payment p
      JOIN Enrollment e ON p.enrollment_id = e.enrollment_id
      JOIN Course c ON e.course_id = c.course_id
      WHERE e.nic = ?
      ORDER BY p.payment_date DESC
    `;

    try {
      const [rows] = await pool.query(query, [nic]);
      return rows;
    } catch (err) {
      console.error(err.message);
      throw err;
    }
  },

  getUserStatus: async (nic) => {
    const query = "SELECT status FROM User WHERE nic = ?";
    const [rows] = await pool.execute(query, [nic]);
    return rows.length ? rows[0].status : null;
  },

};

module.exports = UserModel;
