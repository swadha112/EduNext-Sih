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
      text: "You've just opened your first private practice. How do you attract clients?",
      options: [
        { text: "Start a social media campaign", points: 10 },
        { text: "Collaborate with local hospitals", points: 15 },
        { text: "Rely on word of mouth", points: 5 },
      ],
    },
    {
      text: "A patient opens up about severe childhood trauma. How do you respond?",
      options: [
        { text: "Offer a calm listening ear and reassurance", points: 10 },
        { text: "Prescribe immediate medication", points: -5 },
        { text: "Recommend gradual cognitive behavioral therapy", points: 15 },
      ],
    },
    {
      text: "You're asked to give a public talk on mental health awareness. How do you approach it?",
      options: [
        { text: "Focus on the latest psychological research", points: 15 },
        { text: "Share personal anecdotes to connect with the audience", points: 10 },
        { text: "Decline due to fear of public speaking", points: -5 },
      ],
    },
    {
      text: "A patient is non-compliant with their treatment plan. What do you do?",
      options: [
        { text: "Have a firm conversation and stick to the plan", points: 10 },
        { text: "Listen to their concerns and adjust the plan", points: 15 },
        { text: "Discharge them from your care", points: -5 },
      ],
    },
    {
      text: "You suspect a patient may be a danger to themselves. What is your next step?",
      options: [
        { text: "Contact their family and suggest hospitalization", points: 20 },
        { text: "Ignore it and hope things improve", points: -10 },
        { text: "Refer them to a crisis intervention service", points: 15 },
      ],
    },
    {
      text: "You're offered a prestigious research position in clinical psychology. Do you take it?",
      options: [
        { text: "Accept the position and shift to research", points: 30 },
        { text: "Stay focused on patient care", points: 20 },
        { text: "Ask for time to consider your options", points: 10 },
      ],
    },
  ];

  
  // Handle user's choice and proceed to the next scene
  const handleChoice = (points) => {
    setScore(score + points);
    setPointsPopup(points); // Show points animation
    setTimeout(() => setPointsPopup(null), 1000); // Hide points animation after 1 second
    resetTimer(); // Reset timer after choice is made

    if (scene < scenes.length - 1) {
      setScene(scene + 1);
    } else {
      setGameOver(true); // End the game if it's the last scene
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
      return "A - You've become a highly respected psychologist!";
    } else if (score >= 50) {
      return "B - You've had a solid career as a psychologist.";
    } else {
      return "C - You've faced challenges in the field.";
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