const AdminModel = require("../models/AdminModel");
const UserModel = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SectionModel = require("../models/SectionModel");

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
        { expiresIn: "1d" } // Expires in 2 hours
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
        maxAge: 24 * 60 * 60 * 1000, // 7 days
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
  async getActiveStudents(req, res) {
    try {
      const students = await AdminModel.getActiveStudents();
      res.status(200).json({ students });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  ,

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
  getEnrolledStudents: async (req, res) => {
  
    try {
      const students = await AdminModel.getEnrolledStudents(req.params.courseId);
      res.status(200).json({ students });
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Physical payment
  addPayment: async (req, res) => {
    try {
      const enrollments = req.body.enrollments;
      
      
      await AdminModel.addPayment(enrollments);
      res.status(201).json({ message: "Payment added successfully" });
    } catch (error) {
      console.error("Error adding payment:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
 changeMediumOfCourse:async(req,res)=>{
  try {
      const {nic,courseId,medium}=req.body;
      const result=await SectionModel.changeMedium(courseId,nic,medium);
      if(result.affectedRows>0){
        res.status(200).json({message:"Medium changed successfully",success:true})
      }else{
        res.status(200).json({message:"Medium change unsuccessfull",success:false})
      }
  } catch (error) {
    res.status(200).json({message:error,success:false})
  }
 },

 // User Management Controllers
 getStudentDetails:async(req,res)=>{
  try {
    const { nic } = req.params; // Extract NIC from JWT payload (added by AuthMiddleware)
    const user = await UserModel.getUserProfile(nic);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Failed to fetch user profile" });
  }
},

// Get all courses a user has enrolled in
getStudentCourses: async (req, res) => {
  const { nic } = req.params; // Get user nic from the request's payload (AuthMiddleware)
  

  try {
    const courses = await UserModel.getEnrolledBoughtCourses(nic);

    res.status(200).json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch enrolled courses" });
  }
},


};
module.exports = AdminController;
