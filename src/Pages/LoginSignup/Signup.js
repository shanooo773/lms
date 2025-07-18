import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import background from '../../Assests/background.png';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

export default function Signup() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { success, error: showError } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate form
      if (!formData.name || !formData.email || !formData.password) {
        throw new Error('All fields are required');
      }

      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Register user
      await register(formData.name, formData.email, formData.password);
      success('Registration successful!');
      
      // Redirect to profile page
      navigate('/userprofile');
    } catch (err) {
      setError(err.message || 'Registration failed');
      showError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" h-[90vh] relative flex items-center justify-center  bg-cover bg-center" style={{ backgroundImage:`url(${background})` }}>
    <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="relative  flex items-center justify-center p-6 bg-white bg-opacity-0 shadow-lg backdrop-filter backdrop-blur-md w-full max-w-md h-[90%]" style={{  boxShadow: '0 0 1px 1px rgba(255, 255, 255,0.9)'  }}>
        <form className="w-full" onSubmit={handleSubmit}>
          <h2 className="text-3xl font-bold text-center text-white mb-6">Signup</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500 bg-opacity-70 text-white rounded-xl text-center">
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="name">Name</label>
            <input
              className="w-11/12 ml-5 p-3 rounded-xl bg-[#3B3270] text-white focus:bg-opacity-100 focus:outline-none focus:shadow-outline"
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
              style={{ boxShadow: '0 0 5px 1px rgba(255, 255, 255, 0.5)' }}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="email">Email</label>
            <input
              className="w-11/12 ml-5 p-3 rounded-xl bg-[#3B3270] text-white focus:bg-opacity-100 focus:outline-none focus:shadow-outline"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              style={{ boxShadow: '0 0 5px 1px rgba(255, 255, 255, 0.5)' }}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="password">Password</label>
            <input
              className="w-11/12 p-3 ml-5 rounded-xl bg-[#3B3270] text-white focus:bg-opacity-100 focus:outline-none focus:shadow-outline"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password (min 6 characters)"
              style={{ boxShadow: '0 0 5px 1px rgba(255, 255, 255, 0.5)'  }}
              required
              minLength="6"
            />
          </div>
          <div className="flex items-center justify-between flex-col gap-5 mt-10">
            <button
              className=" w-3/12 p-2 bg-[#5ED5F5] text-black rounded hover:bg-white transition duration-300 self-end font-bold disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Signing up...' : 'Signup'}
            </button>
          <div className="text-center text-white text-lg">
              Already have an account?<Link to={'/login'} className= "underline"> Login </Link>
              </div>
          </div>
        </form>
      </div>
    </div>
  )
}
