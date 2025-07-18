import React, { useState } from 'react';
import InstructorDashboard from '../Components/InstructorDashboard';
import AdminDashboard from '../Components/AdminDashboard';
import CourseManagement from '../Components/CourseManagement';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, 
  faBookOpen, 
  faUserShield,
  faChalkboardTeacher
} from '@fortawesome/free-solid-svg-icons';

const DashboardPage = () => {
  const [userRole, setUserRole] = useState('student'); // This should come from auth context
  const [activeView, setActiveView] = useState('dashboard');
  
  // In a real app, these would come from authentication context
  const userId = "temp_user_id";
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
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            
            {/* Role Selector (for demo purposes) */}
            <select
              value={userRole}
              onChange={(e) => {
                setUserRole(e.target.value);
                setActiveView('dashboard');
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
              <option value="admin">Admin</option>
            </select>
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
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <FontAwesomeIcon icon={faChartLine} className="text-6xl text-blue-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Student Dashboard</h2>
              <p className="text-gray-600 mb-6">
                Track your course progress, view certificates, and manage your learning journey.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Enrolled Courses</h3>
                  <p className="text-2xl font-bold text-blue-600">5</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">Completed</h3>
                  <p className="text-2xl font-bold text-green-600">2</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2">Certificates</h3>
                  <p className="text-2xl font-bold text-purple-600">2</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {isInstructor && activeView === 'dashboard' && (
          isAdmin ? (
            <AdminDashboard />
          ) : (
            <InstructorDashboard instructorId={userId} />
          )
        )}
        
        {isInstructor && activeView === 'courses' && (
          <CourseManagement instructorId={userId} />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;