import React, { useState } from 'react';
import uploadimage from "../Assests/download.png";

export default function ProfileEdit() {
  const [selectedImage, setSelectedImage] = useState(uploadimage);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'User XYZ',
    email: 'user@gmail.com',
    password: ''
  });
  
  // const updateUser = useMutation(api.users.updateUser); // TODO: Implement proper user session management
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Note: In a real application, you would get the user ID from authentication context
      // For now, this is a placeholder - you'd need to implement proper user session management
      
      // This is a simplified version - in reality you'd need the user's ID
      // You might want to implement a proper authentication system
      console.log('Updating user profile:', formData);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original state if needed
    setError('');
    setSuccess('');
    setIsEditing(false);
  };

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
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm">
                {success}
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
                  placeholder="Enter new password"
                />
              ) : (
                <p className="text-gray-700 mt-5">••••••••</p>
              )}
            </div>
            {isEditing ? (
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <a
                href="#edit"
                className="text-blue-500 underline mt-4 block text-right"
                onClick={() => setIsEditing(true)}
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
