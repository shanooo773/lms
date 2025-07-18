import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faClock, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

const QuizComponent = ({ courseId, userId }) => {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [score, setScore] = useState(null);

  // Convex queries
  const quizzes = useQuery(api.quizzes.getQuizzesByCourse, { courseId });
  const userAttempts = useQuery(api.quizzes.getUserQuizAttempts, { userId });

  // Convex mutations
  const submitQuizAttempt = useMutation(api.quizzes.submitQuizAttempt);

  const startQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setAnswers(new Array(quiz.questions.length).fill(-1));
    setCurrentQuestionIndex(0);
    setQuizStarted(true);
    setQuizCompleted(false);
    setScore(null);
    
    if (quiz.timeLimit) {
      setTimeRemaining(quiz.timeLimit * 60); // Convert minutes to seconds
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const submitQuiz = async () => {
    try {
      const result = await submitQuizAttempt({
        userId,
        quizId: selectedQuiz._id,
        answers,
        timeSpent: selectedQuiz.timeLimit ? (selectedQuiz.timeLimit * 60 - timeRemaining) : undefined
      });
      
      setQuizCompleted(true);
      setScore({
        score: result.score || 0,
        maxScore: result.maxScore || selectedQuiz.questions.length,
        percentage: Math.round(((result.score || 0) / (result.maxScore || selectedQuiz.questions.length)) * 100)
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getUserAttemptForQuiz = (quizId) => {
    return userAttempts?.find(attempt => attempt.quizId === quizId);
  };

  // Timer effect
  React.useEffect(() => {
    let timer;
    if (timeRemaining > 0 && quizStarted && !quizCompleted) {
      timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    } else if (timeRemaining === 0 && quizStarted && !quizCompleted) {
      submitQuiz();
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemaining, quizStarted, quizCompleted]);

  if (!quizzes) {
    return <div className="p-6 text-center">Loading quizzes...</div>;
  }

  if (quizzes.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <FontAwesomeIcon icon={faQuestionCircle} className="text-4xl mb-4" />
        <p>No quizzes available for this course yet.</p>
      </div>
    );
  }

  // Quiz completed view
  if (quizCompleted && score) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Quiz Completed!</h2>
          <div className="text-6xl font-bold mb-4" style={{ color: score.percentage >= 70 ? '#10B981' : '#EF4444' }}>
            {score.percentage}%
          </div>
          <p className="text-lg mb-6 text-gray-600">
            You scored {score.score} out of {score.maxScore} points
          </p>
          <button
            onClick={() => {
              setQuizStarted(false);
              setSelectedQuiz(null);
              setQuizCompleted(false);
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    );
  }

  // Quiz in progress view
  if (quizStarted && selectedQuiz) {
    const currentQuestion = selectedQuiz.questions[currentQuestionIndex];
    
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">{selectedQuiz.title}</h2>
            <div className="flex items-center space-x-4">
              {timeRemaining !== null && (
                <div className="flex items-center text-red-600">
                  <FontAwesomeIcon icon={faClock} className="mr-2" />
                  {formatTime(timeRemaining)}
                </div>
              )}
              <div className="text-gray-600">
                Question {currentQuestionIndex + 1} of {selectedQuiz.questions.length}
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 text-gray-800">{currentQuestion.question}</h3>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    answers[currentQuestionIndex] === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestionIndex}`}
                    value={index}
                    checked={answers[currentQuestionIndex] === index}
                    onChange={() => handleAnswerSelect(index)}
                    className="mr-3"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400"
            >
              Previous
            </button>

            <div className="flex space-x-2">
              {selectedQuiz.questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    answers[index] !== -1 ? 'bg-green-500' : 
                    index === currentQuestionIndex ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {currentQuestionIndex === selectedQuiz.questions.length - 1 ? (
              <button
                onClick={submitQuiz}
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Quiz list view
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Course Quizzes</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {quizzes.map((quiz) => {
          const userAttempt = getUserAttemptForQuiz(quiz._id);
          return (
            <div key={quiz._id} className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{quiz.title}</h3>
              {quiz.description && (
                <p className="text-gray-600 mb-4">{quiz.description}</p>
              )}
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <FontAwesomeIcon icon={faQuestionCircle} className="mr-1" />
                    {quiz.questions.length} questions
                  </span>
                  {quiz.timeLimit && (
                    <span className="flex items-center">
                      <FontAwesomeIcon icon={faClock} className="mr-1" />
                      {quiz.timeLimit} min
                    </span>
                  )}
                </div>
              </div>

              {userAttempt ? (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
                  <p className="text-green-800 text-sm">
                    Completed: {userAttempt.score}/{userAttempt.maxScore} 
                    ({Math.round((userAttempt.score / userAttempt.maxScore) * 100)}%)
                  </p>
                </div>
              ) : null}

              <button
                onClick={() => startQuiz(quiz)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faPlay} className="mr-2" />
                {userAttempt ? 'Retake Quiz' : 'Start Quiz'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuizComponent;