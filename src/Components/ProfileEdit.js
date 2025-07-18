import React, { useState, useEffect } from 'react';
import uploadimage from "../Assests/download.png";
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export default function ProfileEdit() {
  const { user, updateProfile } = useAuth();
  const { success, error: showError } = useToast();
  const [selectedImage, setSelectedImage] = useState(uploadimage);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Load user data when component mounts or user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '' // Never pre-fill password for security
      });
    }
  }, [user]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');

    try {
      // Prepare updates object (only include fields that have changed)
      const updates = {};
      
      if (formData.name !== user?.name) {
        updates.name = formData.name;
      }
      
      if (formData.email !== user?.email) {
        updates.email = formData.email;
      }
      
      if (formData.password && formData.password.trim()) {
        if (formData.password.length < 6) {
          throw new Error('Password must be at least 6 characters long');
        }
        updates.password = formData.password;
      }

      // Only update if there are changes
      if (Object.keys(updates).length > 0) {
        await updateProfile(updates);
        success('Profile updated successfully!');
      } else {
        success('No changes to save.');
      }

      setIsEditing(false);
      setFormData(prev => ({ ...prev, password: '' })); // Clear password field
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      showError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset formData to current user data
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: ''
      });
    }
    setError('');
    setIsEditing(false);
  };

  if (!user) {
    return (
      <section className="p-6 bg-gray-100 min-h-[75vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Please log in to view your profile</h2>
          <a href="/login" className="text-blue-500 underline">Go to Login</a>
        </div>
      </section>
    );
  }

  return (
    <section className="p-6 bg-gray-100 min-h-[75vh]">
      <div className="flex flex-col sm:flex-row items-center justify-evenly">
        <div
          className="flex flex-col items-center justify-center w-20 h-20 sm:w-40 sm:h-40 rounded-full bg-gray-200 overflow-hidden cursor-pointer"
          onClick={() => document.getElementById('fileInput').click()}
        >
          <input
            type="file"
            id="fileInput"
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleImageChange}
          />
          <img
            src={selectedImage}
            alt="Profile"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="p-6">
          <div className="text-center mb-6" style={{ marginLeft: "0rem" }}>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">My Profile</h2>
            <hr className="border-gray-300" />
            
            {error && (
              <div className="mb-4 p-3 bg-red-500 bg-opacity-70 text-white rounded-md text-center">
                {error}
              </div>
            )}
            
            <div className='flex gap-2'>
              <h2 className="text-md sm:text-lg font-medium">Name</h2>
              {isEditing ? (
                <input
                  className="text-gray-700 mt-5 border border-gray-300 rounded-md p-2"
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              ) : (
                <p className="text-gray-700 mt-5">{formData.name}</p>
              )}
            </div>
            <div className='flex gap-2'>
              <h2 className="text-md sm:text-lg font-medium">Email</h2>
              {isEditing ? (
                <input
                  className="text-gray-700 mt-5 border border-gray-300 rounded-md p-2"
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              ) : (
                <p className="text-gray-700 mt-5">{formData.email}</p>
              )}
            </div>
            <div className='flex gap-2'>
              <h2 className="text-md sm:text-lg font-medium">Password</h2>
              {isEditing ? (
                <input
                  className="text-gray-700 mt-5 border border-gray-300 rounded-md p-2"
                  type='password'
                  name='password'
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter new password (leave blank to keep current)"
                  minLength="6"
                />
              ) : (
                <p className="text-gray-700 mt-5">••••••••</p>
              )}
            </div>
            {isEditing ? (
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={handleSave}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-700"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <a
                href="#edit"
                className="text-blue-500 underline mt-4 block text-right"
                onClick={(e) => {
                  e.preventDefault();
                  setIsEditing(true);
                }}
              >
                Edit Info
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
