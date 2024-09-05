import React from 'react';

const CardDataStats = ({ title, children }) => {
  return (
    <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
      {/* Container for Image */}
      <div className="flex items-center justify-center h-70 w-50 bg-meta-2 dark:bg-meta-4 overflow-hidden">
        {children}
      </div>

      {/* Title */}
      <div className="mt-4 text-center">
        <span className="text-sm font-medium">{title}</span>
      </div>
    </div>
  );
};

export default CardDataStats;
