import React, { useState } from 'react';
import InstructorDashboard from '../Components/InstructorDashboard';
import AdminDashboard from '../Components/AdminDashboard';
import CourseManagement from '../Components/CourseManagement';
import { useAuth } from '../contexts/AuthContext';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBookOpen, 
  faUserShield,
  faChalkboardTeacher,
  faGraduationCap
} from '@fortawesome/free-solid-svg-icons';

const DashboardPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');
  
  // Get user progress data for students
  const userProgress = useQuery(
    api.functions.updateProgress.getUserProgress,
    user?.userId ? { userId: user.userId } : "skip"
  );

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to access the dashboard</h2>
          <a href="/login" className="text-blue-600 hover:text-blue-800 underline">Go to Login</a>
        </div>
      </div>
    );
  }
  
  const userRole = user.role;
  const isAdmin = userRole === 'admin';
  const isInstructor = userRole === 'instructor' || userRole === 'admin';

  const ViewButton = ({ id, label, icon, active, onClick }) => (
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
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Dashboard - {user.name} ({userRole})
            </h1>
          </div>
          
          <div className="flex space-x-2">
            {isInstructor && (
              <>
                <ViewButton
                  id="dashboard"
                  label={isAdmin ? "Admin Dashboard" : "Instructor Dashboard"}
                  icon={isAdmin ? faUserShield : faChalkboardTeacher}
                  active={activeView === 'dashboard'}
                  onClick={setActiveView}
                />
                <ViewButton
                  id="courses"
                  label="Manage Courses"
                  icon={faBookOpen}
                  active={activeView === 'courses'}
                  onClick={setActiveView}
                />
              </>
            )}
            
            {userRole === 'student' && (
              <div className="text-gray-600">
                <p>Welcome! Browse courses and track your learning progress.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div>
        {userRole === 'student' && (
          <div className="max-w-7xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <FontAwesomeIcon icon={faGraduationCap} className="text-4xl text-blue-600 mr-4" />
                <h2 className="text-2xl font-bold text-gray-900">Student Dashboard</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Track your course progress, view certificates, and manage your learning journey.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Enrolled Courses</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {userProgress ? new Set(userProgress.map(p => p.courseId)).size : 0}
                  </p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">Completed Lessons</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {userProgress ? userProgress.filter(p => p.completed).length : 0}
                  </p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2">Total Progress</h3>
                  <p className="text-2xl font-bold text-purple-600">
                    {userProgress && userProgress.length > 0 
                      ? Math.round((userProgress.filter(p => p.completed).length / userProgress.length) * 100)
                      : 0}%
                  </p>
                </div>
              </div>
              
              {/* Recent Progress */}
              {userProgress && userProgress.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {userProgress
                      .sort((a, b) => (b.lastAccessedAt || 0) - (a.lastAccessedAt || 0))
                      .slice(0, 5)
                      .map((progress, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">Course Progress</p>
                            <p className="text-sm text-gray-600">
                              {progress.completed ? 'Completed' : 'In Progress'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">
                              {progress.lastAccessedAt 
                                ? new Date(progress.lastAccessedAt).toLocaleDateString()
                                : 'No recent activity'
                              }
                            </p>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {isInstructor && activeView === 'dashboard' && (
          isAdmin ? (
            <AdminDashboard />
          ) : (
            <InstructorDashboard instructorId={user.userId} />
          )
        )}
        
        {isInstructor && activeView === 'courses' && (
          <CourseManagement instructorId={user.userId} />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;