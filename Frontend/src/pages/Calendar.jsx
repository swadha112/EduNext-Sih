import React, { useState, useEffect } from 'react';
import {
  Box,
  LinearProgress,
  Typography,
  Button,
  Grid,
  Snackbar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import coinSound from '../images/coin-drop.mp3'; // Add a coin sound file
import coinIcon from '../images/coin.png'; // Add a coin icon
import bitmojiIcon from '../images/bitmoji.jpg'; // Add a bitmoji image

const CareerSelection = () => {
  const [selectedCareer, setSelectedCareer] = useState('');
  const [customCareer, setCustomCareer] = useState('');
  const [startGame, setStartGame] = useState(false); // State to start the RPG

  const careers = [
    'Lawyer',
    'Doctor',
    'Engineer',
    'Teacher',
    'Psychologist',
    'Scientist',
    'Artist',
    'Entrepreneur',
    'Musician',
    'Chef',
    'Architect',
    'Pharmacist',
    'Journalist',
    'Pilot',
    'Athlete',
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
            various career-specific scenarios and challenges. For each scenario,
            you’ll have multiple choices, and each choice will award you a
            certain number of points based on the decision you make. Your goal
            is to make the best decisions that align with the career you've
            chosen. The game features a 15-second timer for each question, so
            make your choices wisely and quickly! At the end of the game, your
            total score will determine how well you've navigated your career
            path.
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
  const [snackbarOpen, setSnackbarOpen] = useState(false);

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
    if (isNaN(points)) return; // Ignore invalid points

    setCoins(coins + points); // Add points to coins
    setCoinPopup(points); // Show coin popup
    playCoinSound(); // Play coin sound effect
    setSnackbarOpen(true); // Show snackbar for coins
    setTimeout(() => setSnackbarOpen(false), 1000);

    const nextScene = scene + 1;

    if (nextScene < scenes.length) {
      setScene(nextScene);
      setProgress(((nextScene + 1) / scenes.length) * 100); // Update progress bar
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

  if (loading)
    return <Typography variant="h6">Loading scenarios...</Typography>;
  if (error)
    return (
      <Typography variant="h6" color="error">
        Error: {error}
      </Typography>
    );
  if (!scenes || scenes.length === 0)
    return <Typography variant="h6">No scenarios available.</Typography>;

  return (
    <Box
      sx={{ padding: 3, backgroundColor: 'background.paper', borderRadius: 2 }}
    >
      {!gameOver ? (
        <Box>
          {scenes[scene] && (
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 'bold', marginBottom: 2 }}
                >
                  {scenes[scene].text}
                </Typography>
                {scenes[scene].details && (
                  <Typography variant="body1" color="textSecondary">
                    <strong>Details:</strong> {scenes[scene].details}
                  </Typography>
                )}
                {scenes[scene].impact && (
                  <Typography variant="body1" color="textSecondary">
                    <strong>Impact:</strong> {scenes[scene].impact}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" flexDirection="column" alignItems="center">
                  {scenes[scene].options &&
                  Array.isArray(scenes[scene].options) &&
                  scenes[scene].options.length > 0 ? (
                    scenes[scene].options.map((option, index) => (
                      <Button
                        key={index}
                        onClick={() => handleChoice(option.points)}
                        variant="contained"
                        color="primary"
                        sx={{
                          marginBottom: 2,
                          borderRadius: 3,
                          width: '100%',
                          maxWidth: '300px',
                          '&:hover': { backgroundColor: 'primary.dark' },
                        }}
                      >
                        {option.text}
                      </Button>
                    ))
                  ) : (
                    <Typography variant="body1" color="textSecondary">
                      No options available
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" justifyContent="center" alignItems="center">
                  <Typography variant="h6" sx={{ marginRight: 2 }}>
                    Time left: {timer}s
                  </Typography>
                  <Box sx={{ width: '80%', position: 'relative' }}>
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: 'lightgray',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#4caf50',
                        },
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: `${progress}%`,
                        transform: 'translateX(-50%) translateY(-50%)',
                        zIndex: 2,
                      }}
                    >
                      <img
                        src={bitmojiIcon}
                        alt="Bitmoji"
                        style={{ width: 35, height: 35, borderRadius: '50%' }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', padding: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
            Game Over
          </Typography>
          <Typography variant="h5" sx={{ marginBottom: 2 }}>
            Total Coins: {coins}
          </Typography>
          <Button
            onClick={() => navigate('/')}
            variant="contained"
            color="secondary"
            sx={{ padding: '10px 20px', borderRadius: 3 }}
          >
            Back to Dashboard
          </Button>
        </Box>
      )}

      {/* Snackbar to show coins earned */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1000}
        onClose={() => setSnackbarOpen(false)}
        message={
          <Box display="flex" alignItems="center">
            <img
              src={coinIcon}
              alt="Coin"
              style={{ width: 25, marginRight: 5 }}
            />
            +{coinPopup}
          </Box>
        }
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ backgroundColor: '#4caf50' }}
      />
    </Box>
  );
};

export default CareerRPG;
