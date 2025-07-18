import React, { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faBookOpen, 
  faDollarSign, 
  faChartLine, 
  faGraduationCap,
  faQuestionCircle
} from '@fortawesome/free-solid-svg-icons';

const InstructorDashboard = ({ instructorId }) => {
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Convex queries
  const dashboardData = useQuery(api.search.getInstructorDashboard, { instructorId });
  const courseAnalytics = useQuery(api.search.getCourseAnalytics, 
    selectedCourse ? { courseId: selectedCourse._id } : "skip"
  );

  if (!dashboardData) {
    return <div className="p-6 text-center">Loading dashboard...</div>;
  }

  const StatCard = ({ icon, title, value, color }) => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color}`}>
          <FontAwesomeIcon icon={icon} className="text-white text-xl" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Instructor Dashboard</h1>
        
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={faBookOpen}
            title="Total Courses"
            value={dashboardData.totalCourses}
            color="bg-blue-500"
          />
          <StatCard
            icon={faUsers}
            title="Total Students"
            value={dashboardData.totalStudents}
            color="bg-green-500"
          />
          <StatCard
            icon={faDollarSign}
            title="Total Revenue"
            value={`$${dashboardData.totalRevenue.toLocaleString()}`}
            color="bg-purple-500"
          />
          <StatCard
            icon={faChartLine}
            title="Avg. Revenue/Course"
            value={`$${dashboardData.totalCourses > 0 ? Math.round(dashboardData.totalRevenue / dashboardData.totalCourses) : 0}`}
            color="bg-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Courses List */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Courses</h2>
            <div className="space-y-4">
              {dashboardData.courses.map((course) => (
                <div
                  key={course._id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedCourse?._id === course._id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedCourse(course)}
                >
                  <h3 className="font-medium text-gray-900">{course.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-green-600 font-medium">${course.price}</span>
                    <span className="text-xs text-gray-500">
                      Created {new Date(course.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
              
              {dashboardData.courses.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FontAwesomeIcon icon={faBookOpen} className="text-4xl mb-4" />
                  <p>No courses created yet</p>
                  <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Create Your First Course
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Course Analytics */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Course Analytics</h2>
            
            {selectedCourse && courseAnalytics ? (
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">{selectedCourse.title}</h3>
                  <p className="text-sm text-gray-600">{selectedCourse.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <FontAwesomeIcon icon={faUsers} className="text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Enrollments</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{courseAnalytics.enrollmentCount}</p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <FontAwesomeIcon icon={faGraduationCap} className="text-green-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Completion Rate</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{courseAnalytics.completionRate}%</p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <FontAwesomeIcon icon={faDollarSign} className="text-purple-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Revenue</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">${courseAnalytics.revenue}</p>
                  </div>
                  
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <FontAwesomeIcon icon={faQuestionCircle} className="text-orange-600 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Quizzes</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-600">{courseAnalytics.quizCount}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-medium text-gray-900 mb-2">Course Performance</h4>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full transition-all duration-300" 
                      style={{ width: `${courseAnalytics.completionRate}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {courseAnalytics.completionRate}% of students have completed this course
                  </p>
                </div>
              </div>
            ) : selectedCourse ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading analytics...</p>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FontAwesomeIcon icon={faChartLine} className="text-4xl mb-4" />
                <p>Select a course to view analytics</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;