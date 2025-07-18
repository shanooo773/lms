// File: src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const registerUser = useMutation(api.functions.auth.registerUser);
  const loginUser = useMutation(api.functions.auth.loginUser);
  const updateUser = useMutation(api.functions.auth.updateUser);
  
  // Get current user data if logged in
  const currentUserData = useQuery(
    api.functions.auth.getCurrentUser, 
    user?.userId ? { userId: user.userId } : "skip"
  );

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('lms_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('lms_user');
      }
    }
    setLoading(false);
  }, []);

  // Update user state when currentUserData changes
  useEffect(() => {
    if (currentUserData && user?.userId) {
      const updatedUser = { ...user, ...currentUserData };
      setUser(updatedUser);
      localStorage.setItem('lms_user', JSON.stringify(updatedUser));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserData, user?.userId]);

  const register = async (name, email, password, role = 'student') => {
    try {
      const userData = await registerUser({ name, email, password, role });
      setUser(userData);
      localStorage.setItem('lms_user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const userData = await loginUser({ email, password });
      setUser(userData);
      localStorage.setItem('lms_user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lms_user');
  };

  const updateProfile = async (updates) => {
    if (!user?.userId) {
      throw new Error('No user logged in');
    }

    try {
      const updatedUserData = await updateUser({
        userId: user.userId,
        ...updates
      });
      setUser(updatedUserData);
      localStorage.setItem('lms_user', JSON.stringify(updatedUserData));
      return updatedUserData;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};