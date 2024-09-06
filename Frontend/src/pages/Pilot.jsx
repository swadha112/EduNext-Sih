import React, { useState, useEffect } from 'react';
import './Career.css'; // Optional CSS for styling
import { useNavigate } from 'react-router-dom'; 
const CareerRPG = () => {
    const navigate = useNavigate();
  // State to keep track of the current scene, user's score, and timer
  const [scene, setScene] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [pointsPopup, setPointsPopup] = useState(null); // State for points animation
  const [timer, setTimer] = useState(15); // 15 seconds timer
  // Array of scenes with storyline, choices, and point values
  const scenes = [
    {
      text: "Congratulations, you've just completed your pilot training! What's your first move?",
      options: [
        { text: "Join a regional airline to gain experience", points: 10 },
        { text: "Try to get hired by a major airline", points: 15 },
        { text: "Take a break before looking for a job", points: 5 },
      ],
    },
    {
      text: "You're flying a commercial flight when you encounter turbulence. How do you handle it?",
      options: [
        { text: "Stay calm and inform the passengers", points: 10 },
        { text: "Fly through it without notifying anyone", points: -5 },
        { text: "Change altitude to avoid it", points: 15 },
      ],
    },
    {
      text: "A mechanical issue occurs mid-flight. What is your next step?",
      options: [
        { text: "Follow emergency procedures and land at the nearest airport", points: 20 },
        { text: "Continue the flight and hope for the best", points: -10 },
        { text: "Contact ground control for advice and follow it", points: 15 },
      ],
    },
    {
      text: "You’re offered a chance to fly internationally. How do you respond?",
      options: [
        { text: "Accept the offer and fly long-haul international routes", points: 20 },
        { text: "Decline and stick to domestic routes", points: 5 },
        { text: "Request more time before making a decision", points: 10 },
      ],
    },
    {
      text: "A passenger becomes unruly during a flight. What do you do?",
      options: [
        { text: "Ask the cabin crew to manage the situation", points: 10 },
        { text: "Try to defuse the situation yourself", points: 5 },
        { text: "Make an emergency landing", points: 15 },
      ],
    },
    {
      text: "You have an opportunity to become a flight instructor. Do you take it?",
      options: [
        { text: "Yes, it's a chance to train the next generation of pilots", points: 30 },
        { text: "No, I want to keep flying commercially", points: 20 },
        { text: "I’ll consider it after more experience", points: 10 },
      ],
    },
  ];

  // Function to handle the user's choice and progress to the next scene
  const handleChoice = (points) => {
    setScore(score + points);
    setPointsPopup(points); // Show points animation
    setTimeout(() => setPointsPopup(null), 1000); // Hide points animation after 1 second

    if (scene < scenes.length - 1) {
      setScene(scene + 1);
    } else {
      setGameOver(true); // End the game if last scene
    }
  };
 // Reset the timer to 15 seconds when a new scene starts
 const resetTimer = () => {
    setTimer(15);
  };

  // Countdown effect for the timer
  useEffect(() => {
    if (timer === 0) {
      handleChoice(0); // If the timer reaches 0, automatically proceed with no points
    }
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on component unmount or scene change
  }, [timer]);
  
  // Grading logic based on the final score
  const getGrade = () => {
    if (score >= 75) {
      return "A - You've become a highly skilled and respected pilot!";
    } else if (score >= 50) {
      return "B - You've built a solid career as a pilot.";
    } else {
      return "C - You've faced some challenges as a pilot.";
    }
  };

  return (
    <div className="rpg-game">
      {!gameOver ? (
        <div>
          <p>{scenes[scene].text}</p>
          {scenes[scene].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleChoice(option.points)}
              className="choice-button"
            >
              {option.text}
            </button>
          ))}
          {pointsPopup !== null && (
            <div className={`points-popup ${pointsPopup > 0 ? 'positive' : 'negative'}`}>
              {pointsPopup > 0 ? `+${pointsPopup}` : pointsPopup}
            </div>
          )}

          {/* Display the timer clock below the options */}
          <div className="timer-clock">
            <p>{timer} seconds left</p>
          </div>
        </div>
      ) : (
        <div className="game-over">
          <h2>Game Over</h2>
          <p>Your final score is: {score}</p>
          <p>{getGrade()}</p>
           {/* Button to go back to career selection page */}
           <button onClick={() => navigate('/roleplay')} className="back-button">
            Back to Career Selection
          </button>
        </div>
      )}
    </div>
  );
};

export default CareerRPG;