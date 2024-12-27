
const express = require("express");
const router = express.Router();
const AuthMiddleware = require("../middleware/Authmiddleware");
const ExtendSessionController = require("../controllers/ExtendSessionController");

router.post("/extend", AuthMiddleware, ExtendSessionController.extendSession);

module.exports = router;