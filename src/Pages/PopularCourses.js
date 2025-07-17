import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import dummydata from '../Components/Dummydata';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export default function PopularCourses() {
  const createUser = useMutation(api.users.createUser);

  useEffect(() => {
    const createDefaultUser = async () => {
      try {
        await createUser({ name: "John Doe", email: "john@example.com", role: "student",password: "123456", });
        console.log("User created");
      } catch (err) {
        console.error("User creation failed:", err);
      }
    };

    createDefaultUser();
  }, [createUser]);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplaySpeed: 3000,
    autoplay: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  function SampleNextArrow({ onClick }) {
    return (
      <div className="absolute top-1/2 right-4 -translate-y-1/2 z-10 cursor-pointer bg-white text-black rounded-full p-1 w-8 flex justify-center items-center h-8 shadow-lg hover:bg-gray-600" onClick={onClick}>
        <FontAwesomeIcon icon={faChevronRight} size="lg" />
      </div>
    );
  }

  function SamplePrevArrow({ onClick }) {
    return (
      <div className="absolute top-1/2 left-4 -translate-y-1/2 z-10 cursor-pointer bg-white text-black rounded-full p-1 w-8 h-8 flex items-center justify-center shadow-lg hover:bg-gray-600" onClick={onClick}>
        <FontAwesomeIcon icon={faChevronLeft} size="lg" />
      </div>
    );
  }

  return (
    <section id='popular' className="pt-20 bg-white w-full">
      <div className="mx-auto">
        <h2 className="py-4 mb-10 text-2xl font-bold text-center md:text-3xl"
          style={{ background: "linear-gradient(to right, rgba(61, 228, 250, 0.8), rgba(51, 192, 253, 0.8), rgba(57, 212, 233, 0.8), rgba(52, 198, 247, 0.8))" }}>
          <span className="text-red-500">Popular</span> Courses
        </h2>

        <div className='w-3/4 m-auto'>
          <div className="mt-20 relative ">
            <Slider {...settings}>
              {dummydata.map((course) => (
                <Link onClick={() => window.scrollTo(0, 0)} to={`/coursedetails/${course.id}`} key={course.id}>
                  <div className="bg-white border border-black rounded-lg shadow-md hover:scale-105 transition-transform duration-300 ease-in-out flex flex-col mx-2">
                    <img src={course.image} alt={course.title} className="object-cover w-full h-48 rounded-t-lg" />
                    <div className="p-5">
                      <h3 className="text-xl font-semibold text-center">{course.title}</h3>
                      <p className="text-center text-gray-500 mb-4">BY: {course.author}</p>
                      <div className="flex justify-end mb-2">
                        <Link onClick={() => window.scrollTo(0, 0)} to={`/course/${course.id}`}>
                          <span className="text-xs hover:underline hover:text-blue-900">Learn more</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </Slider>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-10">
        <button className="px-4 py-2 text-sm font-bold bg-cyan-200 hover:bg-gray-300">
          <Link to="/course">See All Courses</Link>
        </button>
      </div>
    </section>
  );
}
