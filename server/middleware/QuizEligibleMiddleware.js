const { isEligibleForQuiz } = require("../models/UserModel");

const QuizEligibleMiddleware = async (req, res, next) => {
    try {
      const user = req.user; // Use req.user from AuthMiddleware
      const { quizId } = req.params;
  
      if (user.userType === "admin") {
        return next(); // Admins bypass eligibility checks
      }
  
      if (user.userType === "student") {
        const eligible = await isEligibleForQuiz(user.nic, quizId); // Pass necessary params
        if (eligible) {
          return next();
        }
      }
  
      return res.status(403).json({
        success: false,
        message: "Forbidden: You are not eligible to take this quiz",
      });
    } catch (error) {
      console.error("Quiz eligibility error:", error.message);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };  

module.exports = QuizEligibleMiddleware;
