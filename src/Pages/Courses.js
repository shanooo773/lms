import React from 'react';
import CoursesItems from '../Components/Courses_items';
import Searchbar from '../Components/Searchbar';

const Courses = () => (
  <>
    <div className='pt-10 pb-10'>
      <Searchbar fname={'All'} lname={'Courses'} />
    </div>

    <div className='flex flex-col sm:flex-row justify-center items-center'>
      <div className='ml-[2em] mt-[2em] bg-gray-200 w-[250px] p-2 rounded-3xl text-sm sm:text-md'>
        <label className='font-semibold mr-2'>Category:</label>
        <select className='bg-transparent border-none outline-none'>
          <option value="all">All</option>
          <option value="web">Web Development</option>
          <option value="app">App Development</option>
          <option value="cyber">Cyber Security</option>
        </select>
      </div>
      <div className='ml-[2em] mt-[2em] bg-gray-200 w-[250px] p-2 rounded-3xl text-sm sm:text-md'>
        <label className='font-semibold mr-2'>Author:</label>
        <select className='bg-transparent border-none outline-none'>
          <option value="all">All</option>
          <option value="web">Web Development</option>
          <option value="app">App Development</option>
          <option value="cyber">Cyber Security</option>
        </select>
      </div>
    </div>

    <CoursesItems />
  </>
);

export default Courses;
