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
      const query = `
      SELECT 
          u.*, 
          i.index AS student_index, 
          i.batch
      FROM 
          User u
      LEFT JOIN 
          \`Index\` i 
      ON 
          u.nic = i.nic;

      `;
      const [students] = await pool.query(query);
      return students;
    } catch (error) {
      throw error;
    }  
  },
  getActiveStudents:async () => {
    try {
      const [students] = await pool.query("SELECT * FROM User where status='ACTIVE'");
      return students;
    } catch (error) {
      throw error;
    }
  }
  ,

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
  updateStudentStatus: async (nic, status) => {
    try {
      const [result] = await pool.query(
        "UPDATE User SET status = ? WHERE nic = ?",
        [status, nic]
      );
      return result;
    } catch (error) {
      throw error;
    }
  },

  // Get enrolled students by course ID
  getEnrolledStudents: async (courseId) => {
    try {
      const [students] = await pool.query(
        `SELECT 
          u.first_name,
          u.last_name,
          u.nic,
          u.telephone,
          e.medium,
        CASE
            WHEN p.payment_id IS NOT NULL THEN 'PAID'
            ELSE 'NOT PAID'
        END AS payment_status
        FROM 
            User u
        JOIN 
            Enrollment e ON u.nic = e.nic
        LEFT JOIN 
            Payment p ON e.enrollment_id = p.enrollment_id
        WHERE 
            e.course_id = ?;`,
        [courseId]
      );
      return students;
    } catch (error) {
      throw error;
    }
  },

  // Physical payment
  addPayment: async (enrollments) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction(); // Start transaction
  
      for (const enrollment of enrollments) {
        // Check if the enrollment already exists in the Enrollment table
        const [existingEnrollment] = await connection.execute(
          `SELECT enrollment_id FROM Enrollment WHERE nic = ? AND course_id = ?`,
          [enrollment.student_id, enrollment.course_id]
        );
  
        if (existingEnrollment.length > 0) {
          const enrollmentId = existingEnrollment[0].enrollment_id;
  
          // Check if the payment already exists for this enrollment
          const [existingPayment] = await connection.execute(
            `SELECT payment_id FROM Payment WHERE enrollment_id = ?`,
            [enrollmentId]
          );
  
          if (existingPayment.length > 0) {
            // Skip if both enrollment and payment already exist
            console.log(
              `Skipping: User ${enrollment.student_id} is already enrolled and paid for course ${enrollment.course_id}.`
            );
            continue;
          }
  
          // Insert into Payment table if only enrollment exists
          const [courseResult] = await connection.execute(
            `SELECT price FROM Course WHERE course_id = ?`,
            [enrollment.course_id]
          );
          const coursePrice = courseResult[0]?.price;
  
          await connection.execute(
            `INSERT INTO Payment (enrollment_id, payment_type, amount, payment_date)
             VALUES (?, ?, ?, CURDATE())`,
            [enrollmentId, "ONLINE", coursePrice]
          );
  
          console.log(
            `Payment added for user ${enrollment.student_id} in course ${enrollment.course_id}.`
          );
          continue;
        }
        console.log('Medium:', enrollment.medium);

        // If not enrolled, insert into Enrollment and then into Payment
        const [enrollmentResult] = await connection.execute(
          `INSERT INTO Enrollment (nic, course_id, medium) 
           VALUES (?, ?, ?)`,
          [enrollment.student_id, enrollment.course_id, enrollment.medium]
        );
        const enrollmentId = enrollmentResult.insertId;
  
        const [courseResult] = await connection.execute(
          `SELECT price FROM Course WHERE course_id = ?`,
          [enrollment.course_id]
        );
        const coursePrice = courseResult[0]?.price;
  
        await connection.execute(
          `INSERT INTO Payment (enrollment_id, payment_type, amount, payment_date)
           VALUES (?, ?, ?, CURDATE())`,
          [enrollmentId, "ONLINE", coursePrice]
        );
        
        console.log(
          `Enrollment and payment added for user ${enrollment.student_id} in course ${enrollment.course_id}.`
        );
      }
  
      await connection.commit(); // Commit transaction
    } catch (error) {
      await connection.rollback(); // Rollback transaction on error
      console.error("Transaction failed:", error.message);
      throw error;
    } finally {
      await connection.release(); // Release connection
    }
  },   
};

module.exports = AdminModel;
