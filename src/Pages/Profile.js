import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProfileSidebar from '../Components/Profile_Sidebar';
import ProfileEdit from '../Components/ProfileEdit';
import Membership from '../Components/Membership';
import Purchase from '../Components/Purchase';
import CreditCard from '../Components/CreditCard';
import Address from '../Components/Address';
import ProfileContact from '../Components/ProfileContact';
import { useAuth } from '../contexts/AuthContext';

export default function UserProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('editprofile');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // 🚀 Handle tab switch based on URL path
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('membership')) {
      setActiveTab('membership');
    } else if (path.includes('purchase')) {
      setActiveTab('purchase');
    } else if (path.includes('editcreditcard')) {
      setActiveTab('editcreditcard');
    } else if (path.includes('address')) {
      setActiveTab('address');
    } else if (path.includes('profilecontact')) {
      setActiveTab('profilecontact');
    } else {
      setActiveTab('editprofile');
    }
  }, [location.pathname]);

  const renderContent = () => {
    switch (activeTab) {
      case 'editprofile':
        return <ProfileEdit />;
      case 'membership':
        return <Membership />;
      case 'purchase':
        return <Purchase />;
      case 'editcreditcard':
        return <CreditCard />;
      case 'address':
        return <Address />;
      case 'profilecontact':
        return <ProfileContact />;
      default:
        return <ProfileEdit />;
    }
  };

  // Show loading while authentication is being checked
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Please log in to access your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <ProfileSidebar setActiveTab={setActiveTab} activeTab={activeTab} />
      <main className="flex-1 p-6 bg-gray-100">
        {renderContent()}
      </main>
    </div>
  );
}
