import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Logo from '../../images/logo/EduNEXT.png';
import { UserContext } from '../../context/UserContext'; // Import UserContext

const SignIn = () => {
  const { setUser } = useContext(UserContext); // Access the setUser function from the context
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = { email, password };

    try {
      const response = await fetch('http://localhost:5050/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (result.status === 'success') {
        localStorage.setItem('token', result.token); // Store token in localStorage

        // Fetch user profile after login
        const userProfileResponse = await fetch(
          'http://localhost:5050/api/users/profile',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${result.token}`, // Use the token for authentication
            },
          },
        );

        const userProfile = await userProfileResponse.json();

        if (userProfile.status === 'success') {
          // Set user information in context
          setUser(userProfile.data); // Update the UserContext with user data

          // Optionally, store the user in localStorage for persistence
          localStorage.setItem('user', JSON.stringify(userProfile.data));

          Swal.fire({
            icon: 'success',
            title: 'Login successful',
            text: result.message,
            confirmButtonColor: '#007bff',
          }).then(() => {
            navigate('/'); // Navigate to the home page after successful login
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error fetching profile',
            text: 'Could not fetch user profile data. Please try again later.',
            confirmButtonColor: '#007bff',
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login failed',
          text:
            result.message || 'Invalid email or password. Please try again.',
          confirmButtonColor: '#007bff',
        });
      }
    } catch (error) {
      console.error('Error logging in:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred while logging in. Please try again later.',
        confirmButtonColor: '#007bff',
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden md:flex">
        {/* Left section with the logo */}
        <div className="hidden md:flex md:w-1/2 justify-center items-center">
          <div className="p-10 text-center">
            <Link to="/" className="mb-5.5 inline-block">
              <img className="hidden dark:block" src={Logo} alt="Logo" />
              <img className="dark:hidden" src={Logo} alt="Logo" />
            </Link>
            <span className="mt-10 block">{/* SVG content here */}</span>
          </div>
        </div>

        {/* Right section with the sign-in form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 bg-white flex justify-center items-center">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-center text-gray-700 dark:text-white mb-8">
              Sign In
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email input */}
              <div>
                <label className="block text-gray-700 dark:text-white font-medium mb-2">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={handleEmailChange}
                    className="w-full border rounded-lg py-3 px-4 bg-transparent text-gray-700 dark:text-white border-gray-300 dark:border-form-strokedark focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Password input */}
              <div>
                <label className="block text-gray-700 dark:text-white font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="w-full border rounded-lg py-3 px-4 bg-transparent text-gray-700 dark:text-white border-gray-300 dark:border-form-strokedark focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Submit button */}
              <div>
                <input
                  type="submit"
                  value="Sign In"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 cursor-pointer"
                />
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Don’t have an account?
                <Link
                  to="/auth/signup"
                  className="text-blue-600 hover:underline ml-2"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
