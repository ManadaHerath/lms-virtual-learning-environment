import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Book, User, ChevronDown, ChevronUp, Trophy } from 'lucide-react';
import api from '../redux/api';

const StudentProfile = () => {
  const { nic } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const studentResponse = await api.get(`/admin/students/${nic}`);
        setStudent(studentResponse.data.student[0]);
        
        const coursesResponse = await api.get(`/admin/students/${nic}/courses`);
        setCourses(coursesResponse.data);
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [nic]);

  const fetchQuizResults = async (courseId) => {
    try {
      const response = await api.get(`/admin/students/${nic}/courses/${courseId}/quizzes`);
      setQuizResults(response.data);
    } catch (err) {
      console.error("Error fetching quiz results:", err);
    }
  };

  const handleCourseClick = (course) => {
    if (selectedCourse?.course_id === course.course_id) {
      setSelectedCourse(null);
      setQuizResults([]);
    } else {
      setSelectedCourse(course);
      fetchQuizResults(course.course_id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 p-4">
        Error loading student data: {error}
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-8 text-gray-400">
        No student found
      </div>
    );
  }

  const studentInfoFields = [
    { id: 'nic', label: 'NIC', value: student.nic },
    { id: 'name', label: 'Full Name', value: `${student.first_name} ${student.last_name}` },
    { id: 'email', label: 'Email', value: student.email },
    { id: 'batch', label: 'Batch', value: student.batch },
    { id: 'telephone', label: 'Telephone', value: student.telephone },
    { id: 'status', label: 'Status', value: student.status }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-6 border-b border-gray-700/50">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-400 hover:text-gray-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Students
        </button>
      </div>

      <div className="bg-gray-800/30 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-blue-500/20 rounded-lg">
            <User className="w-6 h-6 text-blue-400" />
          </div>
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {studentInfoFields.map(field => (
                <div key={field.id}>
                  <p className="text-sm text-gray-400">{field.label}</p>
                  <p className="text-gray-200">{field.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Book className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-semibold text-gray-200">Enrolled Courses</h2>
        </div>
        
        <div className="grid gap-4">
          {courses.length > 0 ? (
            courses.map((course) => (
              <div key={course.course_id}>
                <div 
                  onClick={() => handleCourseClick(course)}
                  className="bg-gray-800/30 rounded-lg p-6 hover:bg-gray-800/50 transition-colors cursor-pointer"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-200">
                          {course.month}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-3 py-1 text-sm rounded-full bg-blue-500/20 text-blue-400">
                          {course.course_type}
                        </span>
                        {selectedCourse?.course_id === course.course_id ? 
                          <ChevronUp className="w-5 h-5 text-gray-400" /> : 
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        }
                      </div>
                    </div>
                  </div>
                </div>
                
                {selectedCourse?.course_id === course.course_id && (
                  <div className="mt-2 pl-6 pr-2 py-4 bg-gray-800/20 rounded-lg">
                    <h4 className="flex items-center text-lg font-medium text-gray-200 mb-4">
                      <Trophy className="w-5 h-5 text-yellow-400 mr-2" />
                      Quiz Results
                    </h4>
                    {quizResults.length > 0 ? (
                      <div className="space-y-4">
                        {quizResults.map((quiz) => (
                          <div key={quiz.quiz_id} className="bg-gray-800/30 p-4 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="font-medium text-gray-200">{quiz.title}</h5>
                                <p className="text-sm text-gray-400">{quiz.description}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-semibold text-blue-400">
                                  {quiz.score}%
                                </p>
                                <p className="text-sm text-gray-400">
                                  Completed: {new Date(quiz.completed_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-400 py-4">
                        No quiz results available
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">
              No courses enrolled
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;