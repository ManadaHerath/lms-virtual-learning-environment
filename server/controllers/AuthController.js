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

      const token = createToken(result.insertId);

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: maxAge * 1000,
        sameSite: "strict",
      });

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
      const user = await UserModel.findByEmail(req.body.email);

      if (!user) {
        return res.status(400).json({ success: false, message: "User not found" });
      }

      const isMatch = await bcrypt.compare(req.body.password, user.password);

      if (!isMatch) {
        return res.status(400).json({ success: false, message: "Invalid Email or Password" });
      }

      const token = createToken(user.nic);

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: maxAge * 1000,
        sameSite: "strict",
      });

      res.status(200).json({ message: "Login successful", success: true });
    } catch (error) {
      res.status(500).send({ message: `Error in login: ${error.message}` });
    }
  },

  // Logout user
  logoutUser: (req, res) => {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).send({ message: "Logged out successfully", success: true });
  },
};

module.exports = AuthController;
