const UserModel = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleErrors = (err) => {
  let errors = { email: "", password: "" };

  if (err.message === "Email already registered") {
    errors.email = "That email is already registered";
    return errors;
  }

  if (err.message === "incorrect email") {
    errors.email = "That email is not registered";
  }

  if (err.message === "incorrect password") {
    errors.password = "That password is incorrect";
  }

  return errors;
};

const maxAge = 3 * 24 * 60 * 60; // Token expiration (3 days)
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: maxAge });
};

const AuthController = {
  // Create user (Signup)
  createUser: async (req, res) => {
    try {
      const {
        nic, first_name, last_name, email, password, telephone, street_address,
        city, province, postal_code, country, date_of_birth, batch, status
      } = req.body;

      console.log("Request body:", req.body);

      // Check if email is already registered
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          errors: { email: "Email has already been registered" },
        });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Upload image and get URL
      const image_url = req.file ? req.file.path : null;

      // Insert user data into the database
      const newUser = {
        nic, first_name, last_name, email, password: hashedPassword, telephone,
        street_address, city, province, postal_code, country, date_of_birth,
        batch, status, image_url
      };

      const result = await UserModel.create(newUser);

      

      res.status(201).json({
        success: true,
        message: "User created successfully",
      });
    } catch (error) {
      console.error(error);
      const errors = handleErrors(error);
      res.status(500).json({ success: false, errors });
    }
  },


  // Login user
  loginUser: async (req, res) => {
    try {
      const userData = await UserModel.findByEmail(req.body.email);
      

      if (!userData.success) {
        
        return res.status(200).json({ success: false, message: userData.data.message });
      }
      const user=userData.data;
      
      const isMatch = await bcrypt.compare(req.body.password, user.password);

      if (!isMatch) {
        return res.status(200).json({ success: false, message: "Invalid Email or Password" });
      }
      
    // Generate Access Token (short-lived)
    const accessToken = jwt.sign(
      { nic: user.nic, email: req.body.email,userType:"student" },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" } // Expires in 15 minutes
    );

    // Generate Refresh Token (long-lived)
    const refreshToken = jwt.sign(
      { nic: user.nic, email: req.body.email,userType:"student" },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" } // Expires in 7 days
    );

    // Store Refresh Token in HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "strict",
    });

    // Send Access Token to client
    res.status(200).json({
      message: "Login successful",
      success: true,
      accessToken,
    });
    } catch (error) {
      res.status(500).send({ message: `Error in login: ${error.message}` });
    }
  },

  // Logout user
  logoutUser: (req, res) => {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).send({ message: "Logged out successfully", success: true });
  },

  getAllCourses: async (batch, type) => {
    try {
      
      const courses = await UserModel.getAllCourses(batch, type);
      return courses;
    } catch (err) {
      throw err;
    }
  },
  

  // Get course details by ID
  getCourseById: async (req, res) => {
    const { courseId } = req.params;
    
    
    try {
      const course = await UserModel.getCourseById(courseId);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
      res.status(200).json(course);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Failed to fetch course details" });
    }
  },


  // AuthController.js

// Get all courses a user has enrolled in
getEnrolledCourses: async (req, res) => {
  const { nic } = req.user; // Get user nic from the request's payload (AuthMiddleware)
  

  try {
    const courses = await UserModel.getEnrolledCourses(nic);
    
    if (!courses.length) {
      return res.status(404).json({ error: "No enrolled courses found" });
    }
    res.status(200).json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch enrolled courses" });
  }
},


 // In AuthController.js

enrollCourse: async (req, res) => {
  const { courseId } = req.params;
  const { nic } = req.user; // Get user nic from JWT token

  try {
    // Check if user is already enrolled in the course
    const isEnrolled = await UserModel.checkEnrollment(nic, courseId);

    

    if (isEnrolled) {
      console.log('kasun');
      return res.status(400).json({
        success: false,
        message: "You are already enrolled in this course.",
      });
    }

    const result = await UserModel.enrollCourse(nic, courseId);
    console.log(result);
    res.status(200).json({
      success: true,
      message: "Course enrolled successfully!",
      enrollmentId: result.insertId,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to enroll in course" });
  }
},


};

module.exports = AuthController;
