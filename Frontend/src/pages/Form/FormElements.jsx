import React, { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

const FormElements = () => {
  // State to track category selection and interests
  const [category, setCategory] = useState('');
  const [interests, setInterests] = useState(['', '', '', '', '']);
  const [marksheet, setMarksheet] = useState(null);
  const [cv, setCv] = useState(null);

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

  // Handle file uploads
  const handleMarksheetUpload = (e) => {
    setMarksheet(e.target.files[0]);
  };

  const handleCvUpload = (e) => {
    setCv(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic here
    console.log('Form Submitted', {
      category,
      interests,
      marksheet,
      cv,
    });
  };

  return (
    <>
      <Breadcrumb pageName="Form Elements" />

      {/* Updated grid layout to 2 columns */}
      <form onSubmit={handleSubmit}>
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
                  value={category}
                  onChange={handleCategoryChange}
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                >
                  <option value="">Select Category</option>
                  <option value="ug">UG</option>
                  <option value="pg">PG</option>
                </select>

                {category === 'ug' && (
                  <>
                    <label className="mb-3 block text-black dark:text-white">
                      Board
                    </label>
                    <select
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    >
                      <option value="">Select Board</option>
                      <option value="hsc">HSC</option>
                      <option value="cbse">CBSE</option>
                      <option value="icse">ICSE</option>
                      <option value="ig">IG</option>
                    </select>
                  </>
                )}

                {category === 'pg' && (
                  <>
                    <label className="mb-3 block text-black dark:text-white">
                      Program
                    </label>
                    <select
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    >
                      <option value="">Select Program</option>
                      <option value="ms">MS</option>
                      <option value="mba">MBA</option>
                    </select>
                  </>
                )}
              </div>

              {/* Marksheet Upload */}
              <div className="p-6.5">
                <label className="mb-3 block text-black dark:text-white">
                  Upload Latest Marksheet
                </label>
                <input
                  type="file"
                  onChange={handleMarksheetUpload}
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              {/* CV Upload */}
              <div className="p-6.5">
                <label className="mb-3 block text-black dark:text-white">
                  Upload CV
                </label>
                <input
                  type="file"
                  onChange={handleCvUpload}
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
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
                    Top 5 Interests
                  </label>
                  {interests.map((interest, index) => (
                    <input
                      key={index}
                      type="text"
                      value={interest}
                      onChange={(e) =>
                        handleInterestChange(index, e.target.value)
                      }
                      placeholder={`Interest ${index + 1}`}
                      className="mb-3 w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-4 rounded bg-primary py-2 px-4 font-semibold text-white"
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default FormElements;
