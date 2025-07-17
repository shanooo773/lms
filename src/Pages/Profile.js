import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProfileSidebar from '../Components/Profile_Sidebar';
import ProfileEdit from '../Components/ProfileEdit';
import Membership from '../Components/Membership';
import Purchase from '../Components/Purchase';
import CreditCard from '../Components/CreditCard';
import Address from '../Components/Address';
import ProfileContact from '../Components/ProfileContact';
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export default function UserProfile() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('editprofile');
  const createUser = useMutation(api.users.createUser); // ✅ must be inside component

  // 🛡 Prevent multiple user creation calls
  useEffect(() => {
    const alreadyCreated = sessionStorage.getItem('userCreated');

    if (!alreadyCreated) {
      const create = async () => {
        try {
          await createUser({
            name: "John Doe",
            email: "john@example.com",
            role: "user",
            password: "123456",
          });
          console.log("✅ User created successfully");
          sessionStorage.setItem('userCreated', 'true'); // Prevent future calls
        } catch (err) {
          console.error("❌ Failed to create user:", err);
        }
      };

      create();
    }
  }, [createUser]);

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

  return (
    <div className="flex min-h-screen">
      <ProfileSidebar setActiveTab={setActiveTab} activeTab={activeTab} />
      <main className="flex-1 p-6 bg-gray-100">
        {renderContent()}
      </main>
    </div>
  );
}
