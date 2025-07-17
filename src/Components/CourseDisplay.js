import React, { useState } from 'react';
import dummydata from './Dummydata';
import { Link } from 'react-router-dom';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

const CourseDisplay = () => {
  const [visibleCourses, setVisibleCourses] = useState(8);

  const handleLoadMore = () => {
    setVisibleCourses(prev => prev + 8);
  };

  return (
    <div className='flex flex-col gap-10 items-center'>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {dummydata.slice(0, visibleCourses).map((course) => (
          <Link
            key={course.id}
            to={`/course/${course.id}`} // ✅ consistent route
            onClick={() => window.scrollTo(0, 0)}
          >
            <div className="relative bg-white border border-black rounded-lg shadow-md transition-transform duration-300 ease-in-out transform hover:scale-105 h-full flex flex-col">
              <img
                src={course.image}
                alt={course.title}
                className="object-cover w-full h-48 rounded-t-lg"
              />
              <h3 className="mt-4 mb-2 text-xl font-semibold text-center">{course.title}</h3>
              <p className="mb-4 text-center text-gray-500 flex-1">BY: {course.author}</p>
              <div className="flex justify-end mb-2 mr-4">
                <span className='text-xs hover:underline hover:text-blue-900 flex items-center'>
                  Learn more <ArrowRightIcon fontSize="small" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {visibleCourses < dummydata.length && (
        <div className="flex justify-center mt-4">
          <button
            onClick={handleLoadMore}
            className="bg-gray-300 border border-gray-500 font-bold px-4 sm:px-6 py-2 rounded-lg shadow hover:bg-gray-500 text-sm md:text-md"
          >
            See More
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseDisplay;
