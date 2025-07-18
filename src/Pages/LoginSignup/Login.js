import React, { useState } from 'react';
import background from '../../Assests/background.png';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/MockAuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function userlogin(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate form
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Login user
      await login(email, password);
      
      // Redirect to profile page
      navigate('/userprofile');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-[85vh] relative flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(${background})` }}>
      <div className="absolute inset-0 bg-black opacity-40"></div>
      <div className="relative flex items-center justify-center p-6 bg-white bg-opacity-0 shadow-lg backdrop-filter backdrop-blur-md w-full max-w-md h-[90%]"
        style={{ boxShadow: '0 0 1px 1px rgba(255, 255, 255,0.9)' }}>
        <form className="w-full" onSubmit={userlogin}>
          <h2 className="text-3xl font-bold text-center text-white mb-6">Login</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-500 bg-opacity-70 text-white rounded-xl text-center">
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="email">Email</label>
            <input
              className="w-11/12 ml-5 p-3 rounded-xl bg-[#3B3270] text-white focus:bg-opacity-100 focus:outline-none"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              style={{ boxShadow: '0 0 5px 1px rgba(255, 255, 255, 0.5)' }}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2" htmlFor="password">Password</label>
            <input
              className="w-11/12 p-3 ml-5 rounded-xl bg-[#3B3270] text-white focus:bg-opacity-100 focus:outline-none"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{ boxShadow: '0 0 5px 1px rgba(255, 255, 255, 0.5)' }}
              required
            />
          </div>
          <div className="flex items-center justify-between flex-col gap-5 mt-10">
            <button
              className="w-3/12 p-2 bg-[#5ED5F5] text-black rounded hover:bg-white transition duration-300 self-end font-bold disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <Link to={'/signup'} className="text-center text-white underline text-lg">
              Create new account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
