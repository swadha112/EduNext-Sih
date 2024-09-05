import React from 'react';
import CardDataStats from '../../components/CardDataStats';
import HighSchool from '../../images/cards/highschool.jpg'; // Import PNG image
import College from '../../images/cards/cllg.jpg'
const ECommerce = () => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {/* Card with PNG Image and Title */}
        <CardDataStats title="High School">
          <img
            src={HighSchool}
            alt="High School"
            className="h-full w-full object-cover"
            title="High School"
          />
        </CardDataStats>

        <CardDataStats title="University ">
          <img
            src={College}
            alt="College"
            className="h-full w-full object-cover"
            title="College"
          />
        </CardDataStats>
        {/* Other CardDataStats components */}
      </div>

      {/* Other components like ChartOne, ChartTwo, etc. */}
    </>
  );
};

export default ECommerce;
