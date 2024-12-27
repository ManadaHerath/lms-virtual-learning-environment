const express = require("express");
const AdminController = require("../controllers/AdminController");
const AuthMiddleware = require("../middleware/Authmiddleware");

const router = express.Router();

// Define routes
router.post("/login", AdminController.adminLogin);
router.post("/signup",AuthMiddleware(["admin"]),AdminController.createAdmin);
module.exports = router;
