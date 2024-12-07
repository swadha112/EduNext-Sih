import React from 'react';

const CardDataStats = ({ title, children,content }) => {
  return (
    <div className="rounded-lg border bg-#f8f7e5 py-6 px-7.5 shadow-lg dark:border-strokedark dark:bg-boxdark">
      {/* Image Container */}
      <div className="h-48 w-full bg-meta-2 dark:bg-meta-4 overflow-hidden flex items-center justify-center">
        {children}
      </div>

      {/* Title */}
      <div className="mt-4 text-center">
        <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {title}
        </span>
      </div>
      <div className="mt-4 text-center">
        <span className="text-lg font-small text-gray-800 dark:text-gray-200">
          {content}
        </span>
      </div>
    </div>
  );
};

export default CardDataStats;
