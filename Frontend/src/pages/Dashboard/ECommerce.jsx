import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import CardDataStats from '../../components/CardDataStats';
import HighSchool from '../../images/cards/highschool.jpg';
import College from '../../images/cards/cllg.jpg';
import Counsellor from '../../images/cards/counsellor.jpg';
import Professional from '../../images/cards/prof.jpg';
import Chatbot from '../../images/cards/chatbot.png';
import Trends from '../../images/cards/trends.png';
import Quiz from '../../images/cards/quiz.png';
import Interview from '../../images/cards/interview.png';
import Workshop from '../../images/cards/workshop.png';
import Alumini from '../../images/cards/alumini.png';

const ECommerce = () => {
  const [typedText, setTypedText] = useState('');
  const [visible, setVisible] = useState(false); // State to detect if the section is visible for animation
  const fullText = "EduNext";
  const typingSpeed = 150;
  const erasingSpeed = 100;
  const pauseDuration = 1000;

  // Typing effect logic
  useEffect(() => {
    let timer;
    let isTyping = true;
    let index = 0;

    const typeEffect = () => {
      if (isTyping) {
        if (index < fullText.length) {
          setTypedText(fullText.slice(0, index + 1));
          index++;
          timer = setTimeout(typeEffect, typingSpeed);
        } else {
          isTyping = false;
          timer = setTimeout(eraseEffect, pauseDuration);
        }
      }
    };

    const eraseEffect = () => {
      if (index > 0) {
        setTypedText(fullText.slice(0, index - 1));
        index--;
        timer = setTimeout(eraseEffect, erasingSpeed);
      } else {
        isTyping = true;
        timer = setTimeout(typeEffect, pauseDuration);
      }
    };

    timer = setTimeout(typeEffect, pauseDuration);

    return () => clearTimeout(timer);
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const user = JSON.parse(localStorage.getItem('user')) || {};

  const excludedFields = ['cv', 'marksheet', '__v', '_id'];
  const totalFields = Object.keys(user).filter(
    (field) => !excludedFields.includes(field),
  ).length;
  const filledFields = Object.keys(user).filter(
    (field) =>
      !excludedFields.includes(field) && user[field] && user[field] !== '',
  ).length;
  const profileCompletion = totalFields > 0 ? ((filledFields / totalFields) * 100).toFixed(2) : 0;

  const categories = [
    'Technology',
    'Sports',
    'Finance',
    'Fashion',
    'Medical',
    'Arts',
    'Culinary',
    'Law',
    'Management',
    'Aerospace',
    'Agriculture',
  ];

  // Function to observe when the job trends section enters the viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.5 }
    );

    const trendsSection = document.querySelector('#job-trends-section');
    if (trendsSection) observer.observe(trendsSection);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Welcome Message with Fade In Animation */}
      <div className="text-center py-10 bg-gray-50 dark:bg-gray-900 animate-fade-in">
        <h1 className="text-4xl font-bold mb-2">
          Welcome to{' '} <span className="text-black dark:text-lemon-green">{typedText}</span>
          <span className="animate-blink">|</span>
        </h1>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 0.7s infinite;
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        @keyframes slide-up {
          0% {
            opacity: 0;
            transform: translateY(50px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slide-up 1s ease-out;
        }

        @keyframes bounce-in {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          60% {
            transform: scale(1.2);
            opacity: 1;
          }
          100% {
            transform: scale(1);
          }
        }

        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }

        @keyframes bounce-delay {
          0% { opacity: 0; transform: scale(0.5); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* Dashboard-Style Progress Container */}
      <div className="mx-auto my-8 w-3/4 dark:bg-boxdark p-6 rounded-md shadow-md animate-slide-up">
        <h2 className="text-xl mb-2 font-semibold text-gray-800 dark:text-white ">
          You have completed {profileCompletion}% of your profile
        </h2>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4 transition-all duration-500">
          <div
            className="bg-blue-600 h-4 rounded-full"
            style={{ width: `${profileCompletion}%` }}
          ></div>
        </div>
        {profileCompletion < 100 ? (
          <NavLink to="/update" className="text-blue-500 underline">
            Click here to complete your profile
          </NavLink>
        ) : (
          <NavLink to="/chatbot" className="text-blue-500 underline">
            Proceed to Chatbot
          </NavLink>
        )}
      </div>

      {/* Restored Headings */}
      <div className="text-center py-10 bg-gray-50">
        <h1 className="text-4xl font-bold mb-2">Your Journey, Our Expertise.</h1>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 animate-slide-up">
        <CardDataStats title="High School" content="">
          <img
            src={HighSchool}
            alt="High School"
            className="h-full w-full object-cover "
            title="High School"
          />
        </CardDataStats>

        <CardDataStats title="University" content="">
          <img
            src={College}
            alt="College"
            className="h-full w-full object-cover "
            title="College"
          />
        </CardDataStats>

        <CardDataStats title="Counsellors" content="">
          <img
            src={Counsellor}
            alt="Counsellors"
            className="h-full w-full object-cover "
            title="Counsellors"
          />
        </CardDataStats>

        <CardDataStats title="Professionals" content="">
          <img
            src={Professional}
            alt="Professional"
            className="h-full w-full object-cover "
            title="Professional"
          />
        </CardDataStats>
      </div>
 {/* Tagline */}
 <div className="text-center py-5 bg-gray-50">
        <p className="text-lg text-gray-600 mb-2">
          Count on our expertise to make the right choices for your education
          and career.
        </p>
      </div>
      <div className="text-center py-4 bg-gray-50">
        <h1 className="text-4xl font-bold mb-2">
          Career Services Tailored for you.
        </h1>
        </div>

      {/* Horizontal carousel with react-slick */}
      <div className="my-5 px-4 animate-slide-up">
        <Slider {...settings}>
          <div className="px-2 transform hover:scale-105 transition-transform duration-300">
            <NavLink to="/chatbot">
              <CardDataStats
                title="Chatbot"
                content="Chat with our AI to explore career options."
              >
                <img
                  src={Chatbot}
                  alt="Chatbot"
                  className="h-full w-full object-cover"
                  title="Chatbot"
                />
              </CardDataStats>
            </NavLink>
          </div>
          <div className="px-2 transform hover:scale-105 transition-transform duration-300">
            <NavLink to="/quiz">
              <CardDataStats
                title="Dynamic Quizzes"
                content="Test your knowledge with our dynamic quizzes."
              >
                <img
                  src={Quiz}
                  alt="Dynamic Quizzes"
                  className="h-full w-full object-cover"
                  title="Dynamic Quizzes"
                />
              </CardDataStats>
            </NavLink>
          </div>
          <div className="px-2 transform hover:scale-105 transition-transform duration-300">
            <NavLink to="/interview">
              <CardDataStats
                title="Interview Preparation"
                content="Prepare for interviews with behavioral analysis."
              >
                <img
                  src={Interview}
                  alt="Interview Preparation"
                  className="h-full w-full object-cover"
                  title="Interview Preparation"
                />
              </CardDataStats>
            </NavLink>
          </div>
        </Slider>
      </div>

      {/* Explore Job Trends Section with Delayed Bounce-in Animation */}
      <div id="job-trends-section" className="text-center py-10 bg-gray-50 animate-slide-up">
        <h1 className="text-4xl font-bold mb-2">Wondering about your future?</h1>
        <div className="flex flex-wrap justify-center gap-4 my-8">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`px-6 py-3 bg-blue-600 text-white rounded-lg ${
                visible ? `animate-bounce-in delay-${index * 200}` : ''
              }`}
            >
              {category}
            </button>
          ))}
          <NavLink
            to="/tables"
            className={`px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-transform duration-300 transform hover:scale-110 ${
              visible ? 'animate-bounce-in delay-1000' : ''
            }`}
          >
            Explore Job Trends
          </NavLink>
        </div>
        <p className="text-lg text-gray-600 mb-6">
          Take the first step to your future by choosing a field of interest and discovering the trends in the job market.
        </p>
      </div>
    </>
  );
};

export default ECommerce;
