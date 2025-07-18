// File: src/contexts/MockAuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Mock user database (in real app this would be in Convex)
  const mockUsers = JSON.parse(localStorage.getItem('mock_users') || '[]');

  const saveMockUsers = (users) => {
    localStorage.setItem('mock_users', JSON.stringify(users));
  };

  const register = async (name, email, password, role = 'student') => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user already exists
      if (mockUsers.find(u => u.email === email)) {
        throw new Error('User with this email already exists');
      }

      // Create new user
      const newUser = {
        userId: Date.now().toString(),
        name,
        email,
        role,
        createdAt: Date.now(),
        // In real app, password would be hashed on the server
        password: btoa(password + 'salt123')
      };

      const updatedUsers = [...mockUsers, newUser];
      saveMockUsers(updatedUsers);

      const userToReturn = { ...newUser };
      delete userToReturn.password;

      setUser(userToReturn);
      localStorage.setItem('lms_user', JSON.stringify(userToReturn));
      return userToReturn;
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find user
      const hashedPassword = btoa(password + 'salt123');
      const foundUser = mockUsers.find(u => u.email === email && u.password === hashedPassword);
      
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }

      const userToReturn = { ...foundUser };
      delete userToReturn.password;

      setUser(userToReturn);
      localStorage.setItem('lms_user', JSON.stringify(userToReturn));
      return userToReturn;
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check if email is already taken by another user
      if (updates.email) {
        const existingUser = mockUsers.find(u => u.email === updates.email && u.userId !== user.userId);
        if (existingUser) {
          throw new Error('Email is already taken');
        }
      }

      // Update user in mock database
      const userIndex = mockUsers.findIndex(u => u.userId === user.userId);
      if (userIndex !== -1) {
        const updatedUser = { ...mockUsers[userIndex] };
        
        if (updates.name) updatedUser.name = updates.name;
        if (updates.email) updatedUser.email = updates.email;
        if (updates.password) updatedUser.password = btoa(updates.password + 'salt123');

        const updatedUsers = [...mockUsers];
        updatedUsers[userIndex] = updatedUser;
        saveMockUsers(updatedUsers);

        const userToReturn = { ...updatedUser };
        delete userToReturn.password;

        setUser(userToReturn);
        localStorage.setItem('lms_user', JSON.stringify(userToReturn));
        return userToReturn;
      }
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