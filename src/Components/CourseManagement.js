import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faTrash, 
  faVideo,
  faFileText,
  faFilePdf
} from '@fortawesome/free-solid-svg-icons';

const CourseManagement = ({ instructorId }) => {
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCreateModule, setShowCreateModule] = useState(false);
  const [showCreateLesson, setShowCreateLesson] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);

  // Course form state
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    price: 0,
    category: '',
    thumbnailUrl: ''
  });

  // Module form state
  const [moduleForm, setModuleForm] = useState({
    title: '',
    description: '',
    order: 1
  });

  // Lesson form state
  const [lessonForm, setLessonForm] = useState({
    title: '',
    content: '',
    type: 'video',
    order: 1,
    duration: 0
  });

  // Convex queries
  const courses = useQuery(api.courses.getCoursesByInstructor, { instructorId });
  const modules = useQuery(api.modules.getModulesByCourse, 
    selectedCourse ? { courseId: selectedCourse._id } : "skip"
  );
  const lessons = useQuery(api.lessons.getLessonsByModule, 
    selectedModule ? { moduleId: selectedModule._id } : "skip"
  );

  // Convex mutations
  const createCourse = useMutation(api.courses.createCourse);
  const createModule = useMutation(api.modules.createModule);
  const deleteModule = useMutation(api.modules.deleteModule);
  const createLesson = useMutation(api.lessons.createLesson);
  const deleteLesson = useMutation(api.lessons.deleteLesson);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await createCourse({
        title: courseForm.title,
        description: courseForm.description,
        instructorId,
        price: parseFloat(courseForm.price),
        category: courseForm.category,
        thumbnailUrl: courseForm.thumbnailUrl
      });
      
      setCourseForm({
        title: '',
        description: '',
        price: 0,
        category: '',
        thumbnailUrl: ''
      });
      setShowCreateCourse(false);
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  const handleCreateModule = async (e) => {
    e.preventDefault();
    if (!selectedCourse) return;

    try {
      await createModule({
        courseId: selectedCourse._id,
        title: moduleForm.title,
        description: moduleForm.description,
        order: moduleForm.order
      });
      
      setModuleForm({
        title: '',
        description: '',
        order: (modules?.length || 0) + 1
      });
      setShowCreateModule(false);
    } catch (error) {
      console.error('Error creating module:', error);
    }
  };

  const handleCreateLesson = async (e) => {
    e.preventDefault();
    if (!selectedModule || !selectedCourse) return;

    try {
      await createLesson({
        moduleId: selectedModule._id,
        courseId: selectedCourse._id,
        title: lessonForm.title,
        content: lessonForm.content,
        type: lessonForm.type,
        order: lessonForm.order,
        duration: lessonForm.duration || undefined
      });
      
      setLessonForm({
        title: '',
        content: '',
        type: 'video',
        order: (lessons?.length || 0) + 1,
        duration: 0
      });
      setShowCreateLesson(false);
    } catch (error) {
      console.error('Error creating lesson:', error);
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (window.confirm('Are you sure you want to delete this module? This will also delete all lessons in it.')) {
      try {
        await deleteModule({ moduleId });
      } catch (error) {
        console.error('Error deleting module:', error);
      }
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      try {
        await deleteLesson({ lessonId });
      } catch (error) {
        console.error('Error deleting lesson:', error);
      }
    }
  };

  const getLessonIcon = (type) => {
    switch (type) {
      case 'video': return faVideo;
      case 'pdf': return faFilePdf;
      default: return faFileText;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
          <button
            onClick={() => setShowCreateCourse(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Create Course
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Courses List */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Your Courses</h2>
            <div className="space-y-3">
              {courses?.map((course) => (
                <div
                  key={course._id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedCourse?._id === course._id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setSelectedCourse(course);
                    setSelectedModule(null);
                  }}
                >
                  <h3 className="font-medium text-gray-900">{course.title}</h3>
                  <p className="text-sm text-gray-600">${course.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Modules List */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {selectedCourse ? `${selectedCourse.title} - Modules` : 'Select a Course'}
              </h2>
              {selectedCourse && (
                <button
                  onClick={() => setShowCreateModule(true)}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-1" />
                  Module
                </button>
              )}
            </div>
            
            {selectedCourse ? (
              <div className="space-y-3">
                {modules?.map((module) => (
                  <div
                    key={module._id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedModule?._id === module._id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedModule(module)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{module.title}</h3>
                        <p className="text-sm text-gray-600">Order: {module.order}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteModule(module._id);
                        }}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Select a course to view modules</p>
            )}
          </div>

          {/* Lessons List */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {selectedModule ? `${selectedModule.title} - Lessons` : 'Select a Module'}
              </h2>
              {selectedModule && (
                <button
                  onClick={() => setShowCreateLesson(true)}
                  className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-1" />
                  Lesson
                </button>
              )}
            </div>
            
            {selectedModule ? (
              <div className="space-y-3">
                {lessons?.map((lesson) => (
                  <div
                    key={lesson._id}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center mb-1">
                          <FontAwesomeIcon 
                            icon={getLessonIcon(lesson.type)} 
                            className="mr-2 text-gray-500" 
                          />
                          <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                        </div>
                        <p className="text-sm text-gray-600">
                          {lesson.type} • Order: {lesson.order}
                          {lesson.duration && ` • ${lesson.duration}min`}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteLesson(lesson._id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Select a module to view lessons</p>
            )}
          </div>
        </div>

        {/* Create Course Modal */}
        {showCreateCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Create New Course</h3>
              <form onSubmit={handleCreateCourse} className="space-y-4">
                <input
                  type="text"
                  placeholder="Course Title"
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({...courseForm, title: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
                <textarea
                  placeholder="Course Description"
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded h-24"
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={courseForm.price}
                  onChange={(e) => setCourseForm({...courseForm, price: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={courseForm.category}
                  onChange={(e) => setCourseForm({...courseForm, category: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <input
                  type="url"
                  placeholder="Thumbnail URL"
                  value={courseForm.thumbnailUrl}
                  onChange={(e) => setCourseForm({...courseForm, thumbnailUrl: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                  >
                    Create Course
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateCourse(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create Module Modal */}
        {showCreateModule && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Create New Module</h3>
              <form onSubmit={handleCreateModule} className="space-y-4">
                <input
                  type="text"
                  placeholder="Module Title"
                  value={moduleForm.title}
                  onChange={(e) => setModuleForm({...moduleForm, title: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
                <textarea
                  placeholder="Module Description"
                  value={moduleForm.description}
                  onChange={(e) => setModuleForm({...moduleForm, description: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded h-20"
                />
                <input
                  type="number"
                  placeholder="Order"
                  value={moduleForm.order}
                  onChange={(e) => setModuleForm({...moduleForm, order: parseInt(e.target.value)})}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                  >
                    Create Module
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModule(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create Lesson Modal */}
        {showCreateLesson && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Create New Lesson</h3>
              <form onSubmit={handleCreateLesson} className="space-y-4">
                <input
                  type="text"
                  placeholder="Lesson Title"
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm({...lessonForm, title: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
                <select
                  value={lessonForm.type}
                  onChange={(e) => setLessonForm({...lessonForm, type: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="video">Video</option>
                  <option value="text">Text</option>
                  <option value="pdf">PDF</option>
                </select>
                <textarea
                  placeholder="Content (URL for video/PDF, HTML for text)"
                  value={lessonForm.content}
                  onChange={(e) => setLessonForm({...lessonForm, content: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded h-24"
                  required
                />
                <input
                  type="number"
                  placeholder="Duration (minutes)"
                  value={lessonForm.duration}
                  onChange={(e) => setLessonForm({...lessonForm, duration: parseInt(e.target.value) || 0})}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <input
                  type="number"
                  placeholder="Order"
                  value={lessonForm.order}
                  onChange={(e) => setLessonForm({...lessonForm, order: parseInt(e.target.value)})}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="flex-1 bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
                  >
                    Create Lesson
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateLesson(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseManagement;