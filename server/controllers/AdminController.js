const AdminModel = require("../models/AdminModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const AdminController = {
  adminLogin: async (req, res) => {
    try {
      const adminData = await AdminModel.findByEmail(req.body.email);

      if (!adminData.success) {
        return res
          .status(400)
          .json({ success: false, message: adminData.data });
      }
      const admin = adminData.data;

      const isMatch = await bcrypt.compare(req.body.password, admin.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid Email or Password" });
      }

      // Generate Access Token (short-lived)
      const accessToken = jwt.sign(
        { nic: admin.nic, email: req.body.email, userType: "admin", name: `${admin.first_name} ${admin.last_name}`},
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "2h" } // Expires in 2 hours
      );

      // Generate Refresh Token (long-lived)
      const refreshToken = jwt.sign(
        { nic: admin.nic, email: req.body.email, userType: "admin" },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" } // Expires in 7 days
      );

      // Store Refresh Token in HttpOnly cookie
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 2 * 60 * 60 * 1000, // 7 days
        sameSite: "strict",
      });

      // Send Access Token to client
      res.status(200).json({
        message: "Admin Login successful",
        success: true,
        user: {
          nic: admin.nic,
          email: req.body.email,
          userType: "admin",
          name: `${admin.first_name} ${admin.last_name}`,
        }
      });
    } catch (error) {
      res.status(500).send({ message: `Error in login: ${error.message}` });
    }
  },

  createAdmin: async (req, res) => {
    try {
      const { nic, first_name, last_name, email, password, telephone } = req.body;

      // Check if email is already registered
      const existingAdmin = await AdminModel.findByEmail(email);
      if (existingAdmin.success) {
        return res.status(400).json({
          success: false,
          errors: { email: "Email has already been registered" },
        });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Upload image and get URL

      const newAdmin = {
        nic,
        first_name,
        last_name,
        email,
        password: hashedPassword,
        telephone,
      };

      const result = await AdminModel.createAdmin(newAdmin);

      res.status(200).json({
        message: "Admin Created successful",
        success: true,
        user: {
          nic: admin.nic,
          email: req.body.email,
          userType: "admin",
          name: `${admin.first_name} ${admin.last_name}`,
        }
      });
    } catch (error) {
      console.error(error);
      const errors = handleErrors(error);
      res.status(500).json({ success: false, errors });
    }
  },

  adminLogout: async (req, res) => {
    try {
      res.clearCookie("accessToken");
      res.status(200).json({ message: "Admin logged out successfully" });
    } catch (error) {
      res.status(500).send({ message: `Error in logout: ${error.message}` });
    }
  },

  // Check if admin is authenticated
  checkAuth: async (req, res) => {
    try {
      res
        .status(200)
        .json({
          success: true,
          message: "Admin is authenticated",
          user: req.user,
        });
    } catch (error) {
      res.clearCookie('accessToken');
      res.status(500).send({ message: `Error in checkAuth: ${error.message}` });
    }
  },

  async uploadCourse(req, res) {
    try {
      const {
        course_type,
        batch,
        month,
        description,
        price,
        duration,
        progress,
        started_at,
        ended_at,
      } = req.body;
      const imageUrl = req.file.path;

      const courseId = await AdminModel.createCourse({
        course_type,
        batch,
        month,
        description,
        image_url: imageUrl,
        price,
        duration,
        progress,
        started_at,
        ended_at,
      });

      res
        .status(201)
        .json({ message: "Course uploaded successfully", courseId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Student Management Controllers
  // Get all students
  async getStudents(req, res) {
    try {
      const students = await AdminModel.getStudents();
      res.status(200).json({ students });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Get student by ID
  async getStudentById(req, res) {
    try {
      const student = await AdminModel.getStudentById(req.params.id);
      res.status(200).json({ student });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Update student status by ID
  async updateStudentStatus(req, res) {
    try {
      const updatedStudent = await AdminModel.updateStudentStatus(
        req.body.nic,
        req.body.status
      );
      
      res
        .status(200)
        .json({
          message: "Student status updated successfully",
          
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Get enrolled students by course ID
  async getEnrolledStudents(req, res) {
    try {
      const students = await AdminModel.getEnrolledStudents(req.params.courseId, req.params.paid);
      res.status(200).json({ students });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
module.exports = AdminController;
