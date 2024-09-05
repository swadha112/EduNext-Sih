import React from 'react';
import CardDataStats from '../../components/CardDataStats';
import HighSchool from '../../images/cards/highschool.jpg';
import College from '../../images/cards/cllg.jpg';

const ECommerce = () => {
  return (
    <>
      {/* Header Section */}
      <div className="py-8">
        <h1 className="text-5xl font-bold mb-4 text-left">Welcome to EduNext! </h1>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 mt-10">
        {/* Card with PNG Image and Title */}
        <CardDataStats title="High School">
          <img
            src={HighSchool}
            alt="High School"
            className="h-full w-full object-cover"
            title="High School"
          />
        </CardDataStats>

        <CardDataStats title="University">
          <img
            src={College}
            alt="College"
            className="h-full w-full object-cover"
            title="College"
          />
        </CardDataStats>

      </div>

            {/* Tagline */}
            <div className="text-center py-10 bg-gray-50">
              <h1 className="text-4xl font-bold mb-2">Your Journey, Our Expertise.</h1>
              <p className="text-lg text-gray-600 mb-6">Count on our expertise to make the right choices for your education and career.</p>
              <button className="bg-black text-white py-2 px-4 rounded-full">
                Explore all services
              </button>
            </div>

      {/* Other components like ChartOne, ChartTwo, etc. */}
    </>
  );
};

export default ECommerce;
