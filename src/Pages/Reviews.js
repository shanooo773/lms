import React, { useState } from 'react';
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

const Reviews = () => {
  const [name, setName] = useState("");
  const [review, setReview] = useState("");
  const createUser = useMutation(api.users.createUser); // ✅ Hook used properly inside component

  const handleSubmit = async () => {
    try {
      await createUser({
        name: name || "Anonymous",
        email: "example@email.com", // replace or collect this
        role: "user",               // you can change role as needed
        password: "123456",
      });
      alert("Review submitted successfully!");
      setName("");
      setReview("");
    } catch (err) {
      console.error("Failed to submit review:", err);
      alert("Submission failed. Check console.");
    }
  };

  return (
    <div className='mt-10 p-10'>
      <h2 className='font-semibold text-lg '>Reviews (20)</h2>
      <div className='bg-white p-4'>
        <div className='flex flex-col md:flex-row justify-between'>
          <div>
            <span className='text-lg mx-4'>Write a Review :</span>
            <input
              type="text"
              placeholder='Name..'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='bg-[#eeebeb] p-2 outline-none border-2 border-black rounded-md'
            />
          </div>
        </div>

        <textarea
          name="Review"
          rows={4}
          placeholder='Write Here...'
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className='mx-4 bg-[#eeebeb] p-2 outline-none border-2 border-black rounded-md min-w-[90%] md:min-w-[60%] mt-6'
        />

        <div className='flex justify-center'>
          <button
            onClick={handleSubmit}
            className='w-[140px] mt-4 p-2 bg-[#ff0000] text-white font-semibold text-lg rounded-sm'
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
