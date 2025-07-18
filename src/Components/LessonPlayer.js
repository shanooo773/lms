import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faCheck, faComment, faClock } from '@fortawesome/free-solid-svg-icons';

const LessonPlayer = ({ courseId, userId }) => {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [modules, setModules] = useState([]);
  const [currentProgress, setCurrentProgress] = useState({});

  // Convex queries
  const courseModules = useQuery(api.modules.getModulesByCourse, { courseId });
  const courseLessons = useQuery(api.lessons.getLessonsByCourse, { courseId });
  const userProgress = useQuery(api.progress.getProgressByUserCourse, { userId, courseId });

  // Convex mutations
  const updateProgress = useMutation(api.progress.updateProgress);

  useEffect(() => {
    if (courseModules && courseLessons) {
      const modulesWithLessons = courseModules.map(module => ({
        ...module,
        lessons: courseLessons.filter(lesson => lesson.moduleId === module._id).sort((a, b) => a.order - b.order)
      }));
      setModules(modulesWithLessons);

      // Set first lesson as selected if none selected
      if (!selectedLesson && modulesWithLessons.length > 0 && modulesWithLessons[0].lessons.length > 0) {
        setSelectedLesson(modulesWithLessons[0].lessons[0]);
      }
    }
  }, [courseModules, courseLessons, selectedLesson]);

  useEffect(() => {
    if (userProgress) {
      const progressMap = {};
      userProgress.forEach(prog => {
        if (prog.lessonId) {
          progressMap[prog.lessonId] = prog;
        }
      });
      setCurrentProgress(progressMap);
    }
  }, [userProgress]);

  const handleLessonComplete = async (lessonId) => {
    try {
      await updateProgress({
        userId,
        courseId,
        lessonId,
        completed: true,
        watchedDuration: selectedLesson?.duration ? selectedLesson.duration * 60 : undefined
      });
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleLessonSelect = (lesson) => {
    setSelectedLesson(lesson);
  };

  const renderLessonContent = (lesson) => {
    if (!lesson) return <div className="flex items-center justify-center h-64 text-gray-500">Select a lesson to start learning</div>;

    switch (lesson.type) {
      case 'video':
        return (
          <div className="relative">
            <video 
              className="w-full rounded-lg shadow-lg"
              controls
              onEnded={() => handleLessonComplete(lesson._id)}
            >
              <source src={lesson.content} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        );
      case 'text':
        return (
          <div className="prose max-w-none p-6 bg-white rounded-lg shadow-lg">
            <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
            <button
              onClick={() => handleLessonComplete(lesson._id)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Mark as Complete
            </button>
          </div>
        );
      case 'pdf':
        return (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <iframe
              src={lesson.content}
              className="w-full h-96 border rounded"
              title={lesson.title}
            />
            <button
              onClick={() => handleLessonComplete(lesson._id)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Mark as Complete
            </button>
          </div>
        );
      default:
        return <div className="text-gray-500">Unsupported lesson type</div>;
    }
  };

  const isLessonCompleted = (lessonId) => {
    return currentProgress[lessonId]?.completed || false;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 bg-gray-50 min-h-screen">
      {/* Lesson Content Area */}
      <div className="lg:w-2/3">
        {selectedLesson && (
          <>
            <div className="mb-4">
              <h1 className="text-2xl font-bold text-gray-800">{selectedLesson.title}</h1>
              {selectedLesson.duration && (
                <p className="text-gray-600 flex items-center mt-2">
                  <FontAwesomeIcon icon={faClock} className="mr-2" />
                  {selectedLesson.duration} minutes
                </p>
              )}
            </div>
            {renderLessonContent(selectedLesson)}
          </>
        )}
      </div>

      {/* Course Sidebar */}
      <div className="lg:w-1/3">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Course Content</h2>
          
          <div className="space-y-4">
            {modules.map((module) => (
              <div key={module._id} className="border border-gray-200 rounded-lg">
                <div className="bg-gray-100 p-3 font-medium text-gray-800">
                  {module.title}
                </div>
                <div className="p-2">
                  {module.lessons.map((lesson) => (
                    <div
                      key={lesson._id}
                      className={`flex items-center p-2 cursor-pointer rounded transition-colors ${
                        selectedLesson?._id === lesson._id
                          ? 'bg-blue-100 border-l-4 border-blue-600'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleLessonSelect(lesson)}
                    >
                      <div className="flex-shrink-0 w-6 h-6 mr-3">
                        {isLessonCompleted(lesson._id) ? (
                          <FontAwesomeIcon icon={faCheck} className="text-green-600" />
                        ) : (
                          <FontAwesomeIcon 
                            icon={lesson.type === 'video' ? faPlay : faComment} 
                            className="text-gray-400" 
                          />
                        )}
                      </div>
                      <div className="flex-grow">
                        <p className="text-sm font-medium text-gray-800">{lesson.title}</p>
                        {lesson.duration && (
                          <p className="text-xs text-gray-500">{lesson.duration} min</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPlayer;