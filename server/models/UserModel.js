const pool = require("../config/dbconfig");

const UserModel = {
  // Find user by email
  findByEmail: async (email) => {
    const query = "SELECT * FROM User WHERE email = ?";
    try {
      const [result] = await pool.query(query, [email]);
      return result[0]; // Return the first user found (or null if not found)
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
};

module.exports = UserModel;
