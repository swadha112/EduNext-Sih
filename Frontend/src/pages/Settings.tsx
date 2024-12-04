import { useContext, useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import Swal from 'sweetalert2';
import { UserContext } from '../context/UserContext'; // Import UserContext

const predefinedInterests = [
  'Coding',
  'Gaming',
  'Traveling',
  'Music',
  'Sports',
  'Reading',
];

const Settings = () => {
  const { user, setUser } = useContext(UserContext); // Access the UserContext
  const [userData, setUserData] = useState({
    name: '',
    mobileNo: '',
    email: '',
    dob: '',
    gender: '',
    category: 'UG', // Default category
    bio: '',
    interests: [], // Interests as an array
    grade: '',
    stream: '',
  });

  const [selectedInterests, setSelectedInterests] = useState([]);

  useEffect(() => {
    // Fetch user data from local storage
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
      setUserData({
        name: user.name || '',
        mobileNo: user.mobileNo || '',
        email: user.email || '',
        dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
        gender: user.gender || '',
        category: user.category || 'UG',
        bio: user.bio || '',
        interests: user.interests ? user.interests.split(', ') : [], // Convert to array
        grade: user.grade || '',
        stream: user.stream || '',
      });

      // Pre-select user's interests
      setSelectedInterests(user.interests ? user.interests.split(', ') : []);
    }
  }, []);

  const handleInterestChange = (interest) => {
    // Toggle selected interest
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Get token from local storage
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No token found, please sign in again!',
      });
      return;
    }

    try {
      console.log('Old Context (before update):', user);

      const bodyData = {
        name: userData.name,
        mobileNo: userData.mobileNo,
        dob: userData.dob,
        gender: userData.gender,
        category: userData.category,
        bio: userData.bio,
        interests: selectedInterests.join(', '), // Convert array to string
        grade: userData.grade,
        stream: userData.stream,
      };

      const response = await fetch('http://localhost:5050/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Attach the token as a Bearer token
        },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (response.ok) {
        // Update local storage
        localStorage.setItem('user', JSON.stringify(data.data)); // TODO: remove later

        setUser(data.data); // Update UserContext with the new user data

        // Print the new context (after update)
        console.log('New Context (after update):', data.data);

        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Profile updated successfully!',
        }).then(() => {
          // Reload the page after success message
          window.location.reload();
        });
      } else {
        // Show error message
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.message || 'Failed to update profile!',
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Server error while updating profile!',
      });
    }
  };

  return (
    <>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Settings" />

        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Personal Information
                </h3>
              </div>
              <div className="p-7">
                <form onSubmit={handleSubmit}>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="fullName"
                      >
                        Full Name
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-4">
                          {/* Full Name Icon */}
                          <svg
                            className="fill-current"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g opacity="0.8">
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M3.72039 12.887C4.50179 12.1056 5.5616 11.6666 6.66667 11.6666H13.3333C14.4384 11.6666 15.4982 12.1056 16.2796 12.887C17.061 13.6684 17.5 14.7282 17.5 15.8333V17.5C17.5 17.9602 17.1269 18.3333 16.6667 18.3333C16.2064 18.3333 15.8333 17.9602 15.8333 17.5V15.8333C15.8333 15.1703 15.5699 14.5344 15.1011 14.0655C14.6323 13.5967 13.9964 13.3333 13.3333 13.3333H6.66667C6.00363 13.3333 5.36774 13.5967 4.8989 14.0655C4.43006 14.5344 4.16667 15.1703 4.16667 15.8333V17.5C4.16667 17.9602 3.79357 18.3333 3.33333 18.3333C2.8731 18.3333 2.5 17.9602 2.5 17.5V15.8333C2.5 14.7282 2.93899 13.6684 3.72039 12.887Z"
                              />
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M9.99967 3.33329C8.61896 3.33329 7.49967 4.45258 7.49967 5.83329C7.49967 7.214 8.61896 8.33329 9.99967 8.33329C11.3804 8.33329 12.4997 7.214 12.4997 5.83329C12.4997 4.45258 11.3804 3.33329 9.99967 3.33329ZM5.83301 5.83329C5.83301 3.53211 7.69849 1.66663 9.99967 1.66663C12.3009 1.66663 14.1663 3.53211 14.1663 5.83329C14.1663 8.13448 12.3009 9.99996 9.99967 9.99996C7.69849 9.99996 5.83301 8.13448 5.83301 5.83329Z"
                              />
                            </g>
                          </svg>
                        </span>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="fullName"
                          id="fullName"
                          value={userData.name}
                          onChange={(e) =>
                            setUserData({ ...userData, name: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="phoneNumber"
                      >
                        Phone Number
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="phoneNumber"
                        id="phoneNumber"
                        value={userData.mobileNo}
                        onChange={(e) =>
                          setUserData({ ...userData, mobileNo: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="emailAddress"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        {/* Email Icon */}
                        <svg
                          className="fill-current"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g opacity="0.8">
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M3.33301 4.16667C2.87658 4.16667 2.49967 4.54357 2.49967 5V15C2.49967 15.4564 2.87658 15.8333 3.33301 15.8333H16.6663C17.1228 15.8333 17.4997 15.4564 17.4997 15V5C17.4997 4.54357 17.1228 4.16667 16.6663 4.16667H3.33301ZM0.833008 5C0.833008 3.6231 1.9561 2.5 3.33301 2.5H16.6663C18.0432 2.5 19.1663 3.6231 19.1663 5V15C19.1663 16.3769 18.0432 17.5 16.6663 17.5H3.33301C1.9561 17.5 0.833008 16.3769 0.833008 15V5Z"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M0.983719 4.52215C1.24765 4.1451 1.76726 4.05341 2.1443 4.31734L9.99975 9.81615L17.8552 4.31734C18.2322 4.05341 18.7518 4.1451 19.0158 4.52215C19.2797 4.89919 19.188 5.4188 18.811 5.68272L10.4776 11.5161C10.1907 11.7169 9.80879 11.7169 9.52186 11.5161L1.18853 5.68272C0.811486 5.4188 0.719791 4.89919 0.983719 4.52215Z"
                            />
                          </g>
                        </svg>
                      </span>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="email"
                        name="emailAddress"
                        id="emailAddress"
                        value={userData.email}
                        onChange={(e) =>
                          setUserData({ ...userData, email: e.target.value })
                        }
                        disabled
                      />
                    </div>
                  </div>

                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="dateOfBirth"
                      >
                        Date of Birth
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="date"
                        name="dateOfBirth"
                        id="dateOfBirth"
                        value={userData.dob}
                        onChange={(e) =>
                          setUserData({ ...userData, dob: e.target.value })
                        }
                      />
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="gender"
                      >
                        Gender
                      </label>
                      <select
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        name="gender"
                        id="gender"
                        value={userData.gender}
                        onChange={(e) =>
                          setUserData({ ...userData, gender: e.target.value })
                        }
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="category"
                      >
                        Category
                      </label>
                      <select
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        name="category"
                        id="category"
                        value={userData.category}
                        onChange={(e) =>
                          setUserData({ ...userData, category: e.target.value })
                        }
                      >
                        <option value="UG">UG</option>
                        <option value="PG">PG</option>
                        <option value="School">School</option>
                      </select>
                    </div>
                  </div>

                  {['UG', 'PG'].includes(userData.category) && (
                    <div className="mb-5.5">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="cv"
                      >
                        CV Upload
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="file"
                        name="cv"
                        id="cv"
                        accept=".pdf,.doc,.docx"
                      />
                    </div>
                  )}

                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="marksheet"
                    >
                      Marksheet Upload
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="file"
                      name="marksheet"
                      id="marksheet"
                      accept=".pdf,.jpg,.png"
                    />
                  </div>

                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full ">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="bio"
                      >
                        Bio
                      </label>
                      <textarea
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        name="bio"
                        id="bio"
                        placeholder="Tell us about yourself..."
                        value={userData.bio}
                        onChange={(e) =>
                          setUserData({ ...userData, bio: e.target.value })
                        }
                      />
                    </div>

                    {/* <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="interests"
                      >
                        Interests
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="interests"
                        id="interests"
                        placeholder="Enter your interests"
                        value={userData.interests}
                        onChange={(e) =>
                          setUserData({
                            ...userData,
                            interests: e.target.value,
                          })
                        }
                      />
                    </div> */}
                  </div>
                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="interests"
                    >
                      Interests
                    </label>
                    <div className="flex flex-wrap gap-4">
                      {predefinedInterests.map((interest) => (
                        <label
                          key={interest}
                          className="flex items-center cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            checked={selectedInterests.includes(interest)}
                            onChange={() => handleInterestChange(interest)}
                            className="hidden"
                          />
                          <span
                            className={`h-5 w-5 inline-flex items-center justify-center mr-2 border ${
                              selectedInterests.includes(interest)
                                ? 'bg-primary border-primary'
                                : 'border-gray-300'
                            }`}
                          >
                            {selectedInterests.includes(interest) && (
                              <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                ></path>
                              </svg>
                            )}
                          </span>
                          {interest}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="grade"
                      >
                        Grade
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="grade"
                        id="grade"
                        placeholder="Enter your grade"
                        value={userData.grade}
                        onChange={(e) =>
                          setUserData({ ...userData, grade: e.target.value })
                        }
                      />
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="stream"
                      >
                        Stream
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="stream"
                        id="stream"
                        placeholder="Enter your stream"
                        value={userData.stream}
                        onChange={(e) =>
                          setUserData({ ...userData, stream: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-4.5 text-base font-medium text-white transition duration-200 hover:bg-opacity-90"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* <div className="col-span-5 xl:col-span-2">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Profile Picture
                </h3>
              </div>
              <div className="p-7 text-center">
                <img
                  className="mx-auto h-28 w-28 rounded-full border border-stroke bg-gray dark:border-strokedark dark:bg-meta-4"
                  src={userThree}
                  alt="User Profile"
                />
                <div className="mt-5">
                  <button
                    type="button"
                    className="inline-flex h-11 items-center justify-center rounded-lg border border-stroke bg-white px-4.5 text-base font-medium text-black transition duration-200 hover:bg-gray-100 dark:border-strokedark dark:bg-boxdark dark:text-white dark:hover:bg-gray-800"
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-4.5 text-base font-medium text-white transition duration-200 hover:bg-opacity-90"
                  >
                    Update Picture
                  </button>
                </div>
                <input
                  className="mt-5 w-full cursor-pointer rounded border border-stroke py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  type="file"
                  name="profilePicture"
                  id="profilePicture"
                />
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default Settings;
