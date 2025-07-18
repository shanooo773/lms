import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';

const QuizTaker = ({ quiz, onComplete }) => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit * 60); // Convert minutes to seconds
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(null);

  const submitQuizAttempt = useMutation(api.functions.quizzes.submitQuizAttempt);
  const updateProgress = useMutation(api.functions.updateProgress.updateProgress);

  const handleAnswerSelect = (answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      error('Please log in to submit quiz');
      return;
    }

    try {
      // Calculate score locally for display
      let localScore = 0;
      quiz.questions.forEach((question, index) => {
        if (answers[index] === question.correctAnswer) {
          localScore += question.points || 1;
        }
      });

      const maxScore = quiz.questions.reduce((total, q) => total + (q.points || 1), 0);
      setScore({ score: localScore, maxScore });
      
      // Submit to backend
      await submitQuizAttempt({
        userId: user.userId,
        quizId: quiz._id,
        answers: answers,
        timeSpent: (quiz.timeLimit * 60) - timeLeft
      });

      // Update progress
      if (quiz.courseId) {
        await updateProgress({
          userId: user.userId,
          courseId: quiz.courseId,
          completed: localScore >= (maxScore * 0.7) // 70% pass rate
        });
      }

      setQuizCompleted(true);
      success(`Quiz completed! Score: ${localScore}/${maxScore}`);
      
      if (onComplete) {
        onComplete(localScore, maxScore);
      }
    } catch (err) {
      error('Failed to submit quiz: ' + err.message);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  React.useEffect(() => {
    if (quiz.timeLimit && timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !quizCompleted) {
      handleSubmit();
    }
  }, [timeLeft, quizCompleted]);

  if (quizCompleted && score) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz Completed!</h2>
          <div className="text-6xl mb-4">
            {score.score >= (score.maxScore * 0.7) ? '🎉' : '📚'}
          </div>
          <p className="text-xl mb-2">
            Your Score: <span className="font-bold text-blue-600">{score.score}/{score.maxScore}</span>
          </p>
          <p className="text-lg mb-4">
            Percentage: <span className="font-bold">{Math.round((score.score / score.maxScore) * 100)}%</span>
          </p>
          <p className="text-gray-600">
            {score.score >= (score.maxScore * 0.7) 
              ? 'Congratulations! You passed the quiz.' 
              : 'Keep studying and try again!'}
          </p>
        </div>
      </div>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <p className="text-center text-gray-600">No quiz questions available.</p>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Quiz Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{quiz.title}</h2>
          {quiz.timeLimit && (
            <div className="text-lg font-mono bg-gray-100 px-3 py-1 rounded">
              ⏰ {formatTime(timeLeft)}
            </div>
          )}
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <p className="text-gray-600">
          Question {currentQuestion + 1} of {quiz.questions.length}
        </p>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">{question.question}</h3>
        
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <label
              key={index}
              className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                answers[currentQuestion] === index 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input
                type="radio"
                name={`question-${currentQuestion}`}
                value={index}
                checked={answers[currentQuestion] === index}
                onChange={() => handleAnswerSelect(index)}
                className="mr-3"
              />
              <span className="text-gray-800">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition-colors"
        >
          Previous
        </button>
        
        <div className="flex gap-2">
          {currentQuestion === quiz.questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={answers[currentQuestion] === undefined}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizTaker;