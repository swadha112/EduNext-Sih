import React, { useState, useEffect } from 'react';
import { AiFillRead } from 'react-icons/ai';

const domains = [
  'Technology',
  'Sports',
  'Finance',
  'Fashion',
  'Medical',
  'Arts',
  'Culinary',
];

const TableOne = () => {
  const [selectedDomain, setSelectedDomain] = useState('Technology');
  const [newsData, setNewsData] = useState([]);

  // Fetch news from the backend when the domain changes
  useEffect(() => {
    fetchNews(selectedDomain);
  }, [selectedDomain]);

  const fetchNews = async (domain) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/news?domain=${domain}`
      );
      const data = await response.json();
      setNewsData(data.articles.slice(0, 5)); // Get top 5 news articles
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  return (
    <div>
      {/* Domain selection buttons */}
      <div className="mb-4">
        {domains.map((domain) => (
          <button
            key={domain}
            className={`mr-2 px-4 py-2 rounded ${
              selectedDomain === domain
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200'
            }`}
            onClick={() => setSelectedDomain(domain)}
          >
            {domain}
          </button>
        ))}
      </div>

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
          {selectedDomain} Job Market Trends
        </h4>

        <div className="flex flex-col">
          {/* Adjusted grid to increase headline column width */}
          <div className="grid grid-cols-3 sm:grid-cols-5">
            <div className="col-span-1 p-2.5 xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Source
              </h5>
            </div>
            {/* Increase the headline column width */}
            <div className="col-span-3 p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Headline
              </h5>
            </div>
            <div className="col-span-1 p-2.5 text-center xl:p-5">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Published At
              </h5>
            </div>
          </div>

          {newsData.map((news, key) => (
            <div
              className={`grid grid-cols-3 sm:grid-cols-5 ${
                key === newsData.length - 1
                  ? ''
                  : 'border-b border-stroke dark:border-strokedark'
              }`}
              key={key}
            >
              <div className="col-span-1 flex items-center gap-3 p-2.5 xl:p-5">
                <AiFillRead className="text-2xl" />
                <p className="hidden text-black dark:text-white sm:block">
                  {news.source.name}
                </p>
              </div>

              {/* Increase the headline column width */}
              <div className="col-span-3 flex items-center justify-center p-2.5 xl:p-5">
                <a
                  href={news.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  {news.title}
                </a>
              </div>

              <div className="col-span-1 flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-meta-3">
                  {new Date(news.publishedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableOne;
