import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import LessonPlayer from '../Components/LessonPlayer';
import QuizComponent from '../Components/QuizComponent';
import CommentsSection from '../Components/CommentsSection';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faQuestionCircle, faComments } from '@fortawesome/free-solid-svg-icons';

const LearningPage = () => {
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState('lessons');
  
  // In a real app, you'd get the userId from authentication context
  const userId = "temp_user_id"; // This should come from auth context

  const TabButton = ({ id, label, icon, active, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center px-4 py-2 font-medium text-sm rounded-lg transition-colors ${
        active
          ? 'bg-blue-600 text-white'
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
      }`}
    >
      <FontAwesomeIcon icon={icon} className="mr-2" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex space-x-2 mb-4">
            <TabButton
              id="lessons"
              label="Lessons"
              icon={faPlay}
              active={activeTab === 'lessons'}
              onClick={setActiveTab}
            />
            <TabButton
              id="quizzes"
              label="Quizzes"
              icon={faQuestionCircle}
              active={activeTab === 'quizzes'}
              onClick={setActiveTab}
            />
            <TabButton
              id="discussions"
              label="Discussions"
              icon={faComments}
              active={activeTab === 'discussions'}
              onClick={setActiveTab}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto">
        {activeTab === 'lessons' && (
          <LessonPlayer courseId={courseId} userId={userId} />
        )}
        
        {activeTab === 'quizzes' && (
          <div className="p-6">
            <QuizComponent courseId={courseId} userId={userId} />
          </div>
        )}
        
        {activeTab === 'discussions' && (
          <div className="p-6">
            <CommentsSection courseId={courseId} userId={userId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningPage;