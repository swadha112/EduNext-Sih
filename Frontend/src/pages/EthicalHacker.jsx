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
      text: "Congratulations! You’ve just passed your CEH (Certified Ethical Hacker) exam. What’s your first step?",
      options: [
        { text: "Join a cybersecurity consulting firm", points: 10 },
        { text: "Freelance as an ethical hacker", points: 5 },
        { text: "Start your own cybersecurity company", points: 15 },
      ],
    },
    {
      text: "You’re tasked with performing a penetration test for a large corporation. What approach do you take?",
      options: [
        { text: "Start with a reconnaissance phase to gather information", points: 15 },
        { text: "Immediately exploit vulnerabilities", points: -5 },
        { text: "Work with the internal team for better insights", points: 10 },
      ],
    },
    {
      text: "During a vulnerability assessment, you discover sensitive data exposed on the dark web. What do you do?",
      options: [
        { text: "Report it immediately to the company", points: 20 },
        { text: "Use the data to exploit the company to showcase the risks", points: -10 },
        { text: "Inform law enforcement and assist the company", points: 15 },
      ],
    },
    {
      text: "A client offers a bonus if you can breach a competitor’s systems without getting caught. What do you do?",
      options: [
        { text: "Refuse and report the offer", points: 25 },
        { text: "Accept the offer for the bonus", points: -20 },
        { text: "Negotiate for a higher bonus and carry out the task", points: -10 },
      ],
    },
    {
      text: "You’re asked to give a talk on the latest cybersecurity threats at a global conference. How do you approach it?",
      options: [
        { text: "Focus on technical insights and real-life case studies", points: 15 },
        { text: "Talk about general online safety tips", points: 5 },
        { text: "Demonstrate live hacking techniques", points: 10 },
      ],
    },
    {
      text: "You’ve discovered a zero-day vulnerability in a popular software. How do you proceed?",
      options: [
        { text: "Report it to the software company for a bug bounty", points: 30 },
        { text: "Sell the vulnerability to a third-party for profit", points: -30 },
        { text: "Use it for your own gain before reporting", points: -15 },
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

  // Grading logic based on the final score
  const getGrade = () => {
    if (score >= 75) {
      return "A - You've become a highly respected ethical hacker!";
    } else if (score >= 50) {
      return "B - You've built a solid career as an ethical hacker.";
    } else {
      return "C - You've struggled with ethical challenges in the field.";
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
           <button onClick={() => navigate('/calendar')} className="back-button">
            Back to Career Selection
          </button>
        </div>
      )}
    </div>
  );
};

export default CareerRPG;