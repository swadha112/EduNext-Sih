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
  const fullText = "EduNext";
  const typingSpeed = 150;
  const erasingSpeed = 100;
  const pauseDuration = 1000;

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

    // Example completion percentage
  const profileCompletion = 75; // This value can be dynamically set based on user's profile

  return (
    <>
      {/* Welcome Message */}
      <div className="text-center py-10 bg-gray-50">
        <h1 className="text-4xl font-bold mb-2">Welcome to <span>{typedText}</span><span className="animate-blink">|</span></h1>
      </div>

      <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 0.7s infinite;
        }
      `}</style>

      {/* Dashboard-Style Progress Container */}
      <div className="mx-auto my-8 w-3/4 bg-white p-6 rounded-md shadow-md">
        <h2 className="text-xl font-semibold mb-2">
          You have completed {profileCompletion}% of your profile
        </h2>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div
            className="bg-blue-600 h-4 rounded-full"
            style={{ width: `${profileCompletion}%` }}
          ></div>
        </div>
        <NavLink to="/complete-profile" className="text-blue-500 underline">
          Click here to complete your profile
        </NavLink>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats title="High School" content="">
          <img
            src={HighSchool}
            alt="High School"
            className="h-full w-full object-cover"
            title="High School"
          />
        </CardDataStats>

        <CardDataStats title="University" content="">
          <img
            src={College}
            alt="College"
            className="h-full w-full object-cover"
            title="College"
          />
        </CardDataStats>

        <CardDataStats title="Counsellors" content="">
          <img
            src={Counsellor}
            alt="Counsellors"
            className="h-full w-full object-cover"
            title="Counsellors"
          />
        </CardDataStats>

        <CardDataStats title="Professionals" content="">
          <img
            src={Professional}
            alt="Professional"
            className="h-full w-full object-cover"
            title="Professional"
          />
        </CardDataStats>
      </div>

      {/* Tagline */}
      <div className="text-center py-10 bg-gray-50">
        <h1 className="text-4xl font-bold mb-2">
          Your Journey, Our Expertise.
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Count on our expertise to make the right choices for your education
          and career.
        </p>
      </div>

      {/* Horizontal carousel with react-slick */}
      <div className="my-10 px-4">
        <Slider {...settings}>
          <div className="px-2">
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
          <div className="px-2">
            <NavLink to="/quiz">
              <CardDataStats
                title="Dynamic Quizes"
                content="Test your knowledge with our dynamic quizzes."
              >
                <img
                  src={Quiz}
                  alt="Dynamic Quizes"
                  className="h-full w-full object-cover"
                  title="Dynamic Quizes"
                />
              </CardDataStats>
            </NavLink>
          </div>
          <div className="px-2">
            <NavLink to="/interview">
              <CardDataStats
                title="Interview Preparation"
                content="Prepare for interviews with behavioural analysis."
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
          <div className="px-2">
            <NavLink to="/tables">
              <CardDataStats
                title="Market Trends"
                content="Stay updated with the latest market trends."
              >
                <img
                  src={Trends}
                  alt="Market Trends"
                  className="h-full w-full object-cover"
                  title="Market Trends"
                />
              </CardDataStats>
            </NavLink>
          </div>
          <div className="px-2">
            <NavLink to="/workshops">
              <CardDataStats
                title="Upcoming Workshops"
                content="Information on upcoming workshops."
              >
                <img
                  src={Workshop}
                  alt="Upcoming Workshops"
                  className="h-full w-full object-cover"
                  title="Upcoming Workshops"
                />
              </CardDataStats>
            </NavLink>
          </div>
          <div className="px-2">
            <NavLink to="/counsellors">
              <CardDataStats
                title="Counsellors Nearby"
                content="Info of counselors nearby your area."
              >
                <img
                  src={Counsellor}
                  alt="Connect with Counsellors"
                  className="h-full w-full object-cover"
                  title="Connect with Counsellors"
                />
              </CardDataStats>
            </NavLink>
          </div>
          <div className="px-2">
            <NavLink to="/alumini">
              <CardDataStats
                title="Alumini Connect"
                content="Connect with your alumni."
              >
                <img
                  src={Alumini}
                  alt="Alumini Connect"
                  className="h-full w-full object-cover"
                  title="Alumini Connect"
                />
              </CardDataStats>
            </NavLink>
          </div>
        </Slider>
      </div>

      <div className="text-center py-10 bg-gray-50">
        <h1 className="text-4xl font-bold mb-2">
          Career Services Tailored for you.
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Our services are meticulously designed to unveil your potential,
          interests, and skills.
        </p>
      </div>
    </>
  );
};

export default ECommerce;
