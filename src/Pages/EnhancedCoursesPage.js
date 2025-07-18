import React, { useState } from 'react';
import SearchAndFilter from '../Components/SearchAndFilter';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBookOpen, 
  faUser,
  faPlay,
  faGraduationCap
} from '@fortawesome/free-solid-svg-icons';

const EnhancedCoursesPage = () => {
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [showFiltered, setShowFiltered] = useState(false);

  // Get all courses as fallback
  const allCourses = useQuery(api.courses.getAllCourses);

  const handleSearchResults = (results) => {
    setFilteredCourses(results);
    setShowFiltered(true);
  };

  const coursesToDisplay = showFiltered ? filteredCourses : (allCourses || []);

  const CourseCard = ({ course }) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      {/* Course Thumbnail */}
      <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
        {course.thumbnailUrl ? (
          <img 
            src={course.thumbnailUrl} 
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <FontAwesomeIcon icon={faBookOpen} className="text-white text-4xl" />
          </div>
        )}
        <div className="absolute top-4 right-4">
          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-sm font-medium">
            ${course.price}
          </span>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {course.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {course.description}
        </p>

        {/* Course Meta */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span className="flex items-center">
            <FontAwesomeIcon icon={faUser} className="mr-1" />
            Instructor
          </span>
          {course.category && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
              {course.category}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Link
            to={`/learn/${course._id}`}
            className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faPlay} className="mr-2" />
            Start Learning
          </Link>
          <Link
            to={`/course/${course._id}`}
            className="flex-1 border border-blue-600 text-blue-600 text-center py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Your Next Course
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Explore our comprehensive collection of courses designed to help you master new skills and advance your career.
          </p>
          <div className="flex justify-center space-x-8 text-center">
            <div>
              <div className="text-3xl font-bold">{allCourses?.length || 0}</div>
              <div className="text-blue-200">Courses Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold">1000+</div>
              <div className="text-blue-200">Students Enrolled</div>
            </div>
            <div>
              <div className="text-3xl font-bold">50+</div>
              <div className="text-blue-200">Expert Instructors</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Filter */}
        <SearchAndFilter onResultsChange={handleSearchResults} />

        {/* Course Grid */}
        {coursesToDisplay.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {coursesToDisplay.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <FontAwesomeIcon icon={faBookOpen} className="text-6xl text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No courses found</h3>
            <p className="text-gray-500">
              {showFiltered 
                ? "Try adjusting your search criteria or clearing filters"
                : "Courses will appear here once they are created"
              }
            </p>
          </div>
        )}

        {/* Call to Action */}
        {!showFiltered && coursesToDisplay.length > 0 && (
          <div className="mt-16 text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Start Learning?
              </h2>
              <p className="text-gray-600 mb-6">
                Join thousands of students who are already advancing their careers with our courses.
              </p>
              <Link
                to="/dashboard"
                className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FontAwesomeIcon icon={faGraduationCap} className="mr-2" />
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedCoursesPage;