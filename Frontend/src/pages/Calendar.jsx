import React, { useState, useEffect } from 'react';
import './Career.css'; // Optional CSS for styling
import { useNavigate } from 'react-router-dom';
import coinSound from '../images/coin-drop.mp3'; // Add a coin sound file
import coinIcon from '../images/coin.png'; // Add a coin icon
import Lottie from 'react-lottie';
import animationData from '../assets/thinking.json'; // Current animation
import performanceAnimationData from '../assets/congrats.json'; // New performance animation

const CareerSelection = () => {
  const [selectedCareer, setSelectedCareer] = useState('');
  const [customCareer, setCustomCareer] = useState('');
  const [startGame, setStartGame] = useState(false); // State to start the RPG

  const careers = [
    'Lawyer', 'Doctor', 'Engineer', 'Teacher', 'Psychologist', 'Scientist',
    'Artist', 'Entrepreneur', 'Musician', 'Chef', 'Architect', 'Pharmacist',
    'Journalist', 'Pilot', 'Athlete',
  ];

  const handleCareerSelection = (career) => {
    setSelectedCareer(career);
    setStartGame(true); // Start the RPG game
  };

  const handleCustomCareerSubmit = () => {
    if (customCareer.trim()) {
      setSelectedCareer(customCareer.trim());
      setStartGame(true);
    }
  };

  return (
    <div className="gray-container mx-auto my-8 w-3/4 dark:bg-boxdark p-6 rounded-md shadow-md">
      {!startGame ? (
        <div className="career-selection-container">
          <h1 className="text-xl mb-2 font-semibold text-gray-800 dark:text-white">
            Select a Career to Start the Career Simulator
          </h1>
          <p className="text-xl mb-2 text-gray-800 dark:text-white">
            Game Rules: In this Career Simulator, you will be presented with
            various career-specific scenarios and challenges...
          </p>
          <div className="career-buttons-container grid grid-cols-3 gap-4 mt-4">
            {careers.map((career) => (
              <button
                key={career}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                onClick={() => handleCareerSelection(career)}
              >
                {career}
              </button>
            ))}
          </div>
          <div className="mt-6">
            <input
              type="text"
              className="border border-gray-300 rounded py-2 px-4 w-full"
              placeholder="Enter your career of choice"
              value={customCareer}
              onChange={(e) => setCustomCareer(e.target.value)}
            />
            <button
              className="bg-green-500 text-white py-2 px-4 rounded mt-2 hover:bg-green-600"
              onClick={handleCustomCareerSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      ) : (
        <CareerRPG selectedCareer={selectedCareer} />
      )}
    </div>
  );
};

const CareerRPG = ({ selectedCareer }) => {
  const navigate = useNavigate();
  const [scene, setScene] = useState(0); // Current scenario index
  const [scenes, setScenes] = useState([]); // List of scenarios
  const [coins, setCoins] = useState(0); // Total coins earned
  const [gameOver, setGameOver] = useState(false);
  const [coinPopup, setCoinPopup] = useState(null);
  const [progress, setProgress] = useState(0); // Progress percentage
  const [timer, setTimer] = useState(15); // Timer countdown
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animationKey, setAnimationKey] = useState(0); // Track animation reset

  // Fetch career-specific scenarios from the backend
  useEffect(() => {
    const fetchScenarios = async () => {
      if (!selectedCareer) return;

      try {
        const response = await fetch(
          `http://localhost:5050/api/career-scenarios?career=${selectedCareer}`,
        );
        if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setScenes(data.scenarios);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching career scenarios:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchScenarios();
  }, [selectedCareer]);

  const playCoinSound = () => {
    const audio = new Audio(coinSound);
    audio.play();
  };

  const handleChoice = (points) => {
    setCoins(coins + points); // Add points to coins
    setCoinPopup(points); // Show coin popup
    playCoinSound(); // Play coin sound effect
    setTimeout(() => setCoinPopup(null), 1000);

    const nextScene = scene + 1;

    if (nextScene < scenes.length) {
      setScene(nextScene);
      setProgress(((nextScene + 1) / scenes.length) * 100); // Update progress bar
      setAnimationKey(prev => prev + 1); // Increment to trigger animation reset
      resetTimer();
    } else {
      setGameOver(true);
    }
  };

  const resetTimer = () => {
    setTimer(15);
  };

  useEffect(() => {
    if (timer === 0) {
      handleChoice(0); // No coins awarded if time runs out
    }
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  if (loading) return <p>Loading scenarios...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!scenes || scenes.length === 0) return <p>No scenarios available.</p>;

  const getPerformanceMessage = () => {
    if (coins >= 90) return 'You have Excelled in this Career!';
    if (coins >= 70) return 'You have Done Well in this Career!';
    return 'You need Improvement in this Career!';
  };

  return (
    <div className="rpg-game">
      {!gameOver ? (
        <div>
          {scenes[scene] && (
            <>
              <h2>{scenes[scene].text}</h2>

              {scenes[scene].details && (
                <p>
                  <strong>Details:</strong> {scenes[scene].details}
                </p>
              )}
              {scenes[scene].impact && (
                <p>
                  <strong>Impact:</strong> {scenes[scene].impact}
                </p>
              )}

              <div>
                {scenes[scene].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleChoice(option.points)}
                    className="choice-button bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                  >
                    {option.text}
                  </button>
                ))}
              </div>

              {coinPopup !== null && (
                <div className="coin-popup positive">
                  +{coinPopup} <img src={coinIcon} alt="Coin" />
                </div>
              )}

              <div className="timer-clock">{timer} seconds left</div>

              {/* Progress Bar with Lottie Animation */}
              <div className="progress-bar-container">
                <span></span>
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${progress}%` }}
                  >
                    {/* Lottie Animation */}
                    <Lottie
                      key={animationKey} // Reset animation when key changes
                      options={{
                        animationData: animationData,
                        loop: true,
                        autoplay: true,
                        rendererSettings: {
                          preserveAspectRatio: 'xMidYMid slice',
                        },
                      }}
                      height={300}  // Adjust the size as needed
                      width={300}   // Adjust the size as needed
                      isStopped={false}
                      isPaused={false}
                      style={{
                        position: 'absolute',
                        left: `${progress}%`, // Move animation based on progress
                        transform: 'translateX(-50%)', // Center it relative to progress
                        top: '-60px', // Position it above the progress bar
                      }}
                    />
                  </div>
                </div>
                <span></span>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="game-over">
          <h2>Game Over</h2>
          <p>Total Coins: {coins}</p>
          <p>{getPerformanceMessage()}</p>

          {/* New Lottie animation for performance */}
          <Lottie
            options={{
              animationData: performanceAnimationData,
              loop: true,
              autoplay: true,
              rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice',
              },
            }}
            height={300}
            width={300}
          />
          <button onClick={() => navigate('/')} className="back-button">
            Back to Dashboard
          </button>
        </div>
      )}
    </div>
  );
};

export default CareerSelection;
