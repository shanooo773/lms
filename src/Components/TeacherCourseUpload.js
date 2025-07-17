import React, { useState } from 'react';
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export default function TeacherCourseUpload({ userRole, userEmail }) {
  const createCourse = useMutation(api.functions.createCourse.createCourse);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    videoUrl: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await createCourse({
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        videoUrl: formData.videoUrl,
        createdBy: userEmail || 'unknown'
      });
      
      setSuccess('Course created successfully!');
      setFormData({
        title: '',
        description: '',
        price: '',
        videoUrl: ''
      });
    } catch (err) {
      setError('Failed to create course. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user is a teacher
  if (userRole !== 'teacher') {
    return (
      <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded">
        <h2 className="text-xl font-bold mb-2">Access Denied</h2>
        <p>Only teachers can upload courses. Please contact an administrator if you believe this is an error.</p>
      </div>
    );
  }

  return (
    <section className="p-6 bg-gray-100 min-h-[75vh]">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Upload New Course</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Course Title
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter course title"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Course Description
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 h-32"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter course description"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
              Price ($)
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Enter course price"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="videoUrl">
              Video URL
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              type="url"
              id="videoUrl"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleInputChange}
              placeholder="Enter video URL (YouTube, Vimeo, etc.)"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition duration-300 disabled:opacity-50"
            >
              {isLoading ? 'Creating Course...' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}