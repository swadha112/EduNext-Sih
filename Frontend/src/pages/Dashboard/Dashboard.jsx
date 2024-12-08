import React, { useEffect, useRef, useState } from 'react';
import './dashboard.css';
import { NavLink } from 'react-router-dom';
import CardDataStats from '../../components/Cards';
import HighSchool from '../../images/cards/highschool.jpg';
import College from '../../images/cards/cllg.jpg';
import Counsellor from '../../images/cards/counsellor.jpg';
import Professional from '../../images/cards/prof.jpg';
import Lottie from 'lottie-react';
import Chatbot from '../../images/cards/chatbot.png';
import Trends from '../../images/cards/trends.png';
import Quiz from '../../images/cards/quiz.png';
import Interview from '../../images/cards/interview.png';
import Workshop from '../../images/cards/workshop.png';
import Alumini from '../../images/cards/alumini.png';
import Navbar from '../../components/Navbar.jsx'; 
import hatanimation from '../../images/careerHat.json';

const Dashboard = () => {
  const [isAboutUsVisible, setIsAboutUsVisible] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [hatPosition, setHatPosition] = useState(0);
  const aboutUsRef = useRef(null);
  const servicesRef = useRef(null);
  const circleRefs = useRef([]);
  const lottieContainerRef = useRef(null);

  // Scroll position tracking
  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      setScrollPosition(position);
      
      // More gradual hat position calculation
      const maxScroll = window.innerHeight;
      const scrollProgress = Math.min(1, position / maxScroll);
      setHatPosition(scrollProgress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

   // Update scroll position tracking
   useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.pageYOffset);
      
      // Calculate hat position based on scroll
      const servicesSection = servicesRef.current;
      if (servicesSection) {
        const servicesTop = servicesSection.getBoundingClientRect().top;
        const viewportHeight = window.innerHeight;
        const scrollProgress = Math.max(0, Math.min(1, 1 - (servicesTop / viewportHeight)));
        setHatPosition(scrollProgress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          // Reset any previous animations
          circleRefs.current.forEach((ref, index) => {
            if (ref) {
              ref.classList.remove('visible');
              // Trigger reflow to restart animation
              void ref.offsetWidth;

              // Add visible class with staggered delay
              setTimeout(() => {
                ref.classList.add('visible');
              }, index * 200);
            }
          });
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the section is visible
      },
    );

    if (servicesRef.current) {
      observer.observe(servicesRef.current);
    }

    return () => {
      if (servicesRef.current) {
        observer.unobserve(servicesRef.current);
      }
    };
  }, []);

  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       entries.forEach((entry) => {
  //         if (entry.isIntersecting) {
  //           const servicCards = entry.target.querySelectorAll('.service-card');
  //           servicCards.forEach((card, index) => {
  //             setTimeout(() => {
  //               card.classList.add('visible');
  //             }, index * 200); // Stagger animation
  //           });
  //         }
  //       });
  //     },
  //     { threshold: 0.1 } // Trigger when 10% of the section is visible
  //   );

  //   if (servicesRef.current) {
  //     observer.observe(servicesRef.current);
  //   }

  //   return () => {
  //     if (servicesRef.current) {
  //       observer.unobserve(servicesRef.current);
  //     }
  //   };
  // }, []);

  // Removed the card refs and visibility logic for other animations
  // const cardRefs = useRef([useRef(null), useRef(null), useRef(null), useRef(null)]);
  // const [cardVisible, setCardVisible] = useState([false, false, false, false]);

  useEffect(() => {
    const aboutUsObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsAboutUsVisible(entry.isIntersecting); // Set the visibility state based on intersection
      },
      { threshold: 0.5 },
    );

    if (aboutUsRef.current) {
      aboutUsObserver.observe(aboutUsRef.current);
    }

    return () => {
      if (aboutUsRef.current) {
        aboutUsObserver.unobserve(aboutUsRef.current);
      }
    };
  }, []);

  const [isServicesVisible, setIsServicesVisible] = useState(false);
  useEffect(() => {
    const servicesObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsServicesVisible(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    if (servicesRef.current) {
      servicesObserver.observe(servicesRef.current);
    }

    return () => {
      if (servicesRef.current) {
        servicesObserver.unobserve(servicesRef.current);
      }
    };
  }, []);

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="hero-section">
        <div 
          className="ds-title"
          style={{
            transform: `translateY(${scrollPosition * 0.5}px)`,
          }}
        >
          <h1>Shape your future with</h1>
          <h1 className="text-orange-500">EduNext</h1>
          
          <div 
            className="lottie-wrapper"
            style={{ 
              opacity: Math.max(0.5, 1 - hatPosition),
              transform: `scale(${1 - hatPosition * 0.1})` 
            }}
          >
            <Lottie
              animationData={hatanimation}
              autoplay={true}
              loop={true}
              style={{ 
                width: '300px', 
                height: '300px' 
              }}
            />
          </div>
        </div>
      </div>

      {/* //about us section */}

      <div
        className={`about-us ${isAboutUsVisible ? 'animate-slide-up' : ''}`}
        ref={aboutUsRef}
        style={{
          backgroundColor: 'rgba(245, 245, 220, 0.8)', // Slightly more transparent
          position: 'relative',
          zIndex: 10,
        }}
      >
        <h2>About Us</h2>
        <p>
          EduNext is your one-stop career counseling platform, designed to help
          students make informed decisions about their career paths. Our mission
          is to empower students with the resources and guidance they need to
          succeed in their chosen fields.
        </p>
        <h3>Your Journey, Our Expertise.</h3>
        <p>
          Whether you're in high school, college, or looking to make a career
          switch, EduNext provides tailored advice and tools to navigate your
          educational and professional journey.
        </p>

        {/* Grid of Cards without animations */}
        <div className="cards">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <CardDataStats title="High School" content="">
              <img
                src={HighSchool}
                alt="High School"
                className="h-full w-full object-cover rounded-lg shadow-lg"
                title="High School"
              />
            </CardDataStats>

            <CardDataStats title="University" content="">
              <img
                src={College}
                alt="College"
                className="h-full w-full object-cover rounded-lg shadow-lg"
                title="College"
              />
            </CardDataStats>

            <CardDataStats title="Counsellors" content="">
              <img
                src={Counsellor}
                alt="Counsellors"
                className="h-full w-full object-cover rounded-lg shadow-lg"
                title="Counsellors"
              />
            </CardDataStats>

            <CardDataStats title="Professionals" content="">
              <img
                src={Professional}
                alt="Professional"
                className="h-full w-full object-cover rounded-lg shadow-lg"
                title="Professional"
              />
            </CardDataStats>
          </div>
        </div>
      </div>

      {/* <div className="services" ref={servicesRef}>
      <div className="services-title-section">
          <h2>Career Services Tailored Just for You</h2>
        </div>
        <div className="services-cards-section">
          <div className="service-card">
            <NavLink to="/chatbot">
              <div className="service-card-image-container">
                <img src={Chatbot} alt="Chatbot" title="Chatbot" />
              </div>
              <h3 className="service-card-title">Chatbot</h3>
              <p className="service-card-content">
                Chat with our AI to explore career options.
              </p>
            </NavLink>
          </div>
          
          <div className="service-card">
            <NavLink to="/quiz">
              <div className="service-card-image-container">
                <img src={Quiz} alt="Dynamic Quizzes" title="Dynamic Quizzes" />
              </div>
              <h3 className="service-card-title">Dynamic Quizzes</h3>
              <p className="service-card-content">
                Test your knowledge with our dynamic quizzes.
              </p>
            </NavLink>
          </div>

          <div className="service-card">
            <NavLink to="/interview">
              <div className="service-card-image-container">
                <img
                  src={Interview}
                  alt="Interview Preparation"
                  title="Interview Preparation"
                />
              </div>
              <h3 className="service-card-title">Interview Preparation</h3>
              <p className="service-card-content">
                Prepare for interviews with behavioral analysis.
              </p>
            </NavLink>
          </div>

          <div className="service-card">
            <NavLink to="/tables">
              <div className="service-card-image-container">
                <img src={Trends} alt="Market Trends" title="Market Trends" />
              </div>
              <h3 className="service-card-title">Market Trends</h3>
              <p className="service-card-content">
                Stay updated with the latest market trends.
              </p>
            </NavLink>
          </div>

          <div className="service-card">
            <NavLink to="/workshops">
              <div className="service-card-image-container">
                <img
                  src={Workshop}
                  alt="Upcoming Workshops"
                  title="Upcoming Workshops"
                />
              </div>
              <h3 className="service-card-title">Upcoming Workshops</h3>
              <p className="service-card-content">
                Information on upcoming workshops.
              </p>
            </NavLink>
          </div>

          <div className="service-card">
            <NavLink to="/counsellors">
              <div className="service-card-image-container">
                <img
                  src={Counsellor}
                  alt="Connect with Counsellors"
                  title="Connect with Counsellors"
                />
              </div>
              <h3 className="service-card-title">Counsellors Nearby</h3>
              <p className="service-card-content">
                Info on counselors nearby your area.
              </p>
            </NavLink>
          </div>

          <div className="service-card">
            <NavLink to="/alumni">
              <div className="service-card-image-container">
                <img
                  src={Alumini}
                  alt="Alumni Connect"
                  title="Alumni Connect"
                />
              </div>
              <h3 className="service-card-title">Alumni Connect</h3>
              <p className="service-card-content">Connect with your alumni.</p>
            </NavLink>
          </div>
        </div>
      </div> */}

      <div
        className="services"
        ref={servicesRef}
        style={{
          backgroundColor: `rgba(25, 25, 25, ${0.8 + hatPosition * 0.2})`, // Increase opacity as we scroll
          position: 'relative',
          zIndex: hatPosition > 0.5 ? 8 : 10, // Adjust z-index based on scroll
          backdropFilter: 'blur(5px)', // Add blur effect
        }}
      >
        <div className="services-content-wrapper">
          <div className="services-title-section">
            <h2>Career Services Tailored Just for You</h2>
            <p>
              At EduNext, we believe that every student's journey is unique, and
              so should be their career guidance. Our platform offers a range of
              personalized services designed to help students make informed
              decisions and achieve their career goals with confidence. No
              matter the age, our services cater to your specific needs at every
              stage of your journey.
            </p>
            <div className="decorative-circles">
              <div className="circle"></div>
              <div className="circle"></div>
            </div>
          </div>
          <div className="services-cards-section">
            {[
              {
                img: Chatbot,
                title: 'Chatbot',
                content: 'Chat with our AI to explore career options',
                link: '/chatbot',
              },
              {
                img: Quiz,
                title: 'Dynamic Quizzes',
                content: 'Test your knowledge with our dynamic quizzes',
                link: '/quiz',
              },
              {
                img: Interview,
                title: 'Interview Preparation',
                content: 'Prepare for interviews with behavioral analysis',
                link: '/interview',
              },
              {
                img: Trends,
                title: 'Market Trends',
                content: 'Stay updated with the latest market trends',
                link: '/tables',
              },
              {
                img: Workshop,
                title: 'Upcoming Workshops',
                content: 'Information on upcoming workshops',
                link: '/workshops',
              },
              {
                img: Counsellor,
                title: 'Counsellors Nearby',
                content: 'Info on counselors nearby your area',
                link: '/counsellors',
              },
              {
                img: Alumini,
                title: 'Alumni Connect',
                content: 'Connect with your alumni',
                link: '/alumni',
              },
            ].map((service, index) => (
              <div
                key={service.title}
                className="service-card"
                ref={(el) => (circleRefs.current[index] = el)}
              >
                <NavLink to={service.link}>
                  <div className="service-card-image-container">
                    <img
                      src={service.img}
                      alt={service.title}
                      title={service.title}
                    />
                  </div>
                  <h3 className="service-card-title">{service.title}</h3>
                  <p className="service-card-content">{service.content}</p>
                </NavLink>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='footer'>
        <h3 className="bg-stone-900 text-[#f5f5dc] text-center">A project by Team SurfExcel © 2024. All rights reserved.</h3>
      </div>
    </div>
  );
};

export default Dashboard;
