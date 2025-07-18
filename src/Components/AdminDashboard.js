import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faBookOpen, 
  faDollarSign, 
  faUserGraduate,
  faChalkboardTeacher,
  faUserShield
} from '@fortawesome/free-solid-svg-icons';

const AdminDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('overview');

  // Convex queries
  const dashboardData = useQuery(api.search.getAdminDashboard);
  const allUsers = useQuery(api.users.getAllUsers);
  const allCourses = useQuery(api.courses.getAllCourses);
  const allContactMessages = useQuery(api.contacts.getAllContactMessages);

  // Convex mutations
  const updateMessageStatus = useMutation(api.contacts.updateContactMessageStatus);

  const handleMessageStatusUpdate = async (messageId, status) => {
    try {
      await updateMessageStatus({ messageId, status });
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  };

  if (!dashboardData) {
    return <div className="p-6 text-center">Loading admin dashboard...</div>;
  }

  const StatCard = ({ icon, title, value, color, subtitle }) => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color}`}>
          <FontAwesomeIcon icon={icon} className="text-white text-xl" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  const TabButton = ({ id, label, active, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`px-4 py-2 font-medium text-sm rounded-lg ${
        active
          ? 'bg-blue-600 text-white'
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  );

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={faUsers}
          title="Total Users"
          value={dashboardData.totalUsers}
          color="bg-blue-500"
        />
        <StatCard
          icon={faBookOpen}
          title="Total Courses"
          value={dashboardData.totalCourses}
          color="bg-green-500"
        />
        <StatCard
          icon={faUserGraduate}
          title="Total Enrollments"
          value={dashboardData.totalEnrollments}
          color="bg-purple-500"
        />
        <StatCard
          icon={faDollarSign}
          title="Total Revenue"
          value={`$${dashboardData.totalRevenue.toLocaleString()}`}
          color="bg-orange-500"
        />
      </div>

      {/* User Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">User Distribution</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faUserGraduate} className="text-blue-600 mr-3" />
                <span className="text-gray-700">Students</span>
              </div>
              <span className="font-semibold text-gray-900">{dashboardData.usersByRole.students}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faChalkboardTeacher} className="text-green-600 mr-3" />
                <span className="text-gray-700">Instructors</span>
              </div>
              <span className="font-semibold text-gray-900">{dashboardData.usersByRole.instructors}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faUserShield} className="text-purple-600 mr-3" />
                <span className="text-gray-700">Admins</span>
              </div>
              <span className="font-semibold text-gray-900">{dashboardData.usersByRole.admins}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">System Health</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Pending Messages</span>
              <span className={`font-semibold ${
                dashboardData.pendingContactMessages > 5 ? 'text-red-600' : 'text-green-600'
              }`}>
                {dashboardData.pendingContactMessages}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Avg Revenue/Course</span>
              <span className="font-semibold text-gray-900">
                ${dashboardData.totalCourses > 0 ? Math.round(dashboardData.totalRevenue / dashboardData.totalCourses) : 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Avg Enrollments/Course</span>
              <span className="font-semibold text-gray-900">
                {dashboardData.totalCourses > 0 ? Math.round(dashboardData.totalEnrollments / dashboardData.totalCourses) : 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const UsersTab = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">All Users</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Role</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {allUsers?.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-900">{user.name}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{user.email}</td>
                <td className="px-4 py-2 text-sm">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                    user.role === 'instructor' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const CoursesTab = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">All Courses</h3>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {allCourses?.map((course) => (
          <div key={course._id} className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">{course.title}</h4>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-green-600">${course.price}</span>
              <span className="text-xs text-gray-500">
                {new Date(course.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const MessagesTab = () => (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Contact Messages</h3>
      <div className="space-y-4">
        {allContactMessages?.map((message) => (
          <div key={message._id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium text-gray-900">{message.name}</h4>
                <p className="text-sm text-gray-600">{message.email}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                  message.status === 'new' ? 'bg-red-100 text-red-800' :
                  message.status === 'read' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {message.status || 'new'}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(message.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <p className="text-gray-700 mb-3">{message.message}</p>
            <div className="flex space-x-2">
              {message.status !== 'read' && (
                <button
                  onClick={() => handleMessageStatusUpdate(message._id, 'read')}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  Mark as Read
                </button>
              )}
              {message.status !== 'replied' && (
                <button
                  onClick={() => handleMessageStatusUpdate(message._id, 'replied')}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                  Mark as Replied
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg w-fit">
            <TabButton
              id="overview"
              label="Overview"
              active={selectedTab === 'overview'}
              onClick={setSelectedTab}
            />
            <TabButton
              id="users"
              label="Users"
              active={selectedTab === 'users'}
              onClick={setSelectedTab}
            />
            <TabButton
              id="courses"
              label="Courses"
              active={selectedTab === 'courses'}
              onClick={setSelectedTab}
            />
            <TabButton
              id="messages"
              label="Messages"
              active={selectedTab === 'messages'}
              onClick={setSelectedTab}
            />
          </div>
        </div>

        {/* Tab Content */}
        {selectedTab === 'overview' && <OverviewTab />}
        {selectedTab === 'users' && <UsersTab />}
        {selectedTab === 'courses' && <CoursesTab />}
        {selectedTab === 'messages' && <MessagesTab />}
      </div>
    </div>
  );
};

export default AdminDashboard;