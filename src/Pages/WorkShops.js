import React, { useState } from 'react';
import CourseDisplay from '../Components/CourseDisplay';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareXmark } from '@fortawesome/free-solid-svg-icons';
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

const WorkShops = () => {
  const [displayForm, setDisplayForm] = useState(false);

  const [formData, setFormData] = useState({
    workshop: '',
    name: '',
    phone: '',
    email: '',
    experience: '',
    interest: '',
    linkedin: ''
  });

  const createUser = useMutation(api.users.createUser); // ✅ Hook is valid here

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await createUser({
        name: formData.name,
        email: formData.email,
        role: "workshop-attendee",
        password: "123456",
      });

      alert("Workshop registration submitted!");
      setDisplayForm(false);
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className='relative bg-[#E3FAFF] flex flex-col gap-10 items-center px-6 sm:px-10 md:px-16 lg:px-24 py-10'>
      <div className='flex justify-between items-center w-full'>
        <div className='flex flex-col gap-4'>
          <h2 className='text-md md:text-xl font-semibold'>Upcoming Workshops</h2>
          <div className='h-1 w-full bg-gray-800'></div>
        </div>
        <button onClick={() => setDisplayForm(true)} className='bg-[#6A2C2C] text-white font-semibold rounded-md p-2 hover:bg-[red] text-sm sm:text-md'>Register</button>
      </div>

      <CourseDisplay />

      {displayForm && (
        <div className='absolute w-full h-full bg-black top-0 bg-opacity-50 flex flex-col items-center gap-10 py-20'>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className='px-4 sm:px-1 relative bg-white w-[100%] sm:w-[90%] md:w-[55%] items-center flex flex-col py-10 gap-5 rounded-md'>
            <FontAwesomeIcon onClick={() => setDisplayForm(false)} icon={faSquareXmark} className='absolute right-10 top-10 text-xl text-blue-500 cursor-pointer' />
            <h2 className='text-sm sm:text-md md:text-xl font-sans font-semibold mb-5 self-start sm:self-center'>Register for Workshop</h2>

            <div className='flex flex-col gap-5'>
              <div className='flex gap-5 font-sans items-center '>
                <p className='w-full text-sm'>Select Workshop:</p>
                <select
                  className='border rounded-xl border-black bg-blue-200 p-1 px-4 text-sm'
                  value={formData.workshop}
                  onChange={(e) => handleChange('workshop', e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="web development">Web Development</option>
                  <option value="data science">Data Science</option>
                  <option value="cyber security">Cyber Security</option>
                  <option value="graphic designing">Graphic Designing</option>
                  <option value="game development">Game Development</option>
                </select>
              </div>

              {["name", "phone", "email", "experience", "interest", "linkedin"].map(field => (
                <label key={field} className='flex gap-5 font-sans items-center'>
                  <p className='w-full text-sm capitalize'>{field.replace(/([A-Z])/g, ' $1')}:</p>
                  <input
                    type={field === "email" ? "email" : "text"}
                    className='border rounded-xl border-black bg-gray-200 p-1 px-2 text-sm'
                    value={formData[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                  />
                </label>
              ))}
            </div>

            <button type="submit" className='text-sm bg-blue-600 text-gray-300 w-40 rounded-md py-1 text-center'>
              Apply Now!
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default WorkShops;
