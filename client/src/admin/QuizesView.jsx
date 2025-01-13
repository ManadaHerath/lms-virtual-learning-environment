import React, { useEffect } from 'react'

const QuizesView = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState(null);

    const handleChooseQuiz = (quizId) => {
        const quiz = quizzes.find((quiz) => quiz.id === parseInt(quizId));
        setSelectedQuiz(quiz);
      };

   useEffect(()=>{
    const handleGetQuiz = async () => {
        try {
            
          const res = await api.get("/admin/quizzes");
          if (!res.data.success) {
            throw new Error("Failed to load quizzes");
          }
          setQuizzes(res.data.quizzes);
          
        } catch (error) {
          enqueueSnackbar(error.message, { variant: "error" });
        }
      };
      handleGetQuiz();


   },[])
    
  return (
    <div>QuizesView</div>
  )
}

export default QuizesView