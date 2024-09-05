import React, { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

const FormElements = () => {
  // State to track category selection and interests
  const [category, setCategory] = useState('');
  const [interests, setInterests] = useState(['', '', '', '', '']);

  // Handle category change
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  // Handle top 5 interests change
  const handleInterestChange = (index, value) => {
    const newInterests = [...interests];
    newInterests[index] = value;
    setInterests(newInterests);
  };

  return (
    <>
      <Breadcrumb pageName="Form Elements" />

      {/* Updated grid layout to 2 columns */}
      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        {/* Left Column: Input Fields and Select Input */}
        <div className="flex flex-col gap-9">
          {/* Input Fields */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Input Fields
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Mobile
                </label>
                <input
                  type="text"
                  placeholder="Mobile"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Select Input */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Select Input
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <label className="mb-3 block text-black dark:text-white">
                Category
              </label>
              <select
                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                value={category}
                onChange={handleCategoryChange}
              >
                <option value="">Select Category</option>
                <option value="UG">UG</option>
                <option value="PG">PG</option>
              </select>

              {/* Conditional rendering for UG and PG options */}
              {category === 'UG' && (
                <div>
                  <label className="mt-5 mb-3 block text-black dark:text-white">
                    Board (Only for UG)
                  </label>
                  <select className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
                    <option value="">Select Board</option>
                    <option value="HSC">HSC</option>
                    <option value="ICSE">ICSE</option>
                    <option value="CBSE">CBSE</option>
                    <option value="IG">IG</option>
                  </select>
                </div>
              )}

              {category === 'PG' && (
                <div>
                  <label className="mt-5 mb-3 block text-black dark:text-white">
                    Program (Only for PG)
                  </label>
                  <select className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
                    <option value="">Select Program</option>
                    <option value="MS">MS</option>
                    <option value="MBA">MBA</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Additional Information */}
        <div className="flex flex-col gap-9">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Additional Information
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Standard/Year
                </label>
                <input
                  type="text"
                  placeholder="Standard/Year"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Stream
                </label>
                <input
                  type="text"
                  placeholder="Stream"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Subjects
                </label>
                <input
                  type="text"
                  placeholder="Subjects"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Previous CGPA
                </label>
                <input
                  type="text"
                  placeholder="Previous CGPA"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div>
                <label className="mb-3 block text-black dark:text-white">
                  Top 5 Interests
                </label>
                {interests.map((interest, index) => (
                  <input
                    key={index}
                    type="text"
                    placeholder={`Interest ${index + 1}`}
                    value={interest}
                    onChange={(e) =>
                      handleInterestChange(index, e.target.value)
                    }
                    className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary mb-3"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FormElements;
