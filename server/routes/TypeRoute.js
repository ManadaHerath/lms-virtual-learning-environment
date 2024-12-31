const express = require("express");
const router = express.Router();
const AuthMiddleware = require("../middleware/Authmiddleware");
const TypeController = require("../controllers/TypeController");

router.get('/' ,AuthMiddleware(['admin','student']),TypeController.getAlltypes  );
router.get('/:typeId',AuthMiddleware(['admin','student']),TypeController.getTypeById);
router.put('/',AuthMiddleware(['admin','student']),TypeController.updateTypeById);
module.exports=router;