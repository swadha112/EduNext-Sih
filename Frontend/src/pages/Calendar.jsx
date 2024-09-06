import React, { useState } from 'react';
import Lawyer from './Lawyer';  // Import the RPG components for each career
import Doctor from './pyschologist';
import Pilot from './Pilot';
import EthicalHacker from './EthicalHacker';
import './CareerSelection.css'; // Optional CSS for custom styling

const CareerSelection = () => {
  const [selectedCareer, setSelectedCareer] = useState(null);

  // Handle career selection
  const handleCareerSelection = (career) => {
    setSelectedCareer(career);
  };

  // Render the career component based on user's choice
  const renderCareerRPG = () => {
    switch (selectedCareer) {
      case 'lawyer':
        return <Lawyer />;
      case 'doctor':
        return <Doctor />;
      case 'pilot':
        return <Pilot />;
      case 'ethicalHacker':
        return <EthicalHacker />;
      default:
        return null;
    }
  };

  return (
    <div className="gray-container mx-auto my-8 w-3/4 dark:bg-boxdark p-6 rounded-md shadow-md">
      <div className="career-selection">
        {!selectedCareer ? (
          <div className="career-selection-container">
            <h1 className="text-xl mb-2 font-semibold text-gray-800 dark:text-white ">Select a Career to Start the Role-Playing Game</h1>
            <p className="text-xl mb-2  text-gray-800 dark:text-white ">Game Rules: In this role-playing game, you will be presented with various career-specific scenarios and challenges. For each scenario, you’ll have multiple choices, and each choice will award you a certain number of points based on the decision you make. Your goal is to make the best decisions that align with the career you've chosen. The game features a 15-second timer for each question, so make your choices wisely and quickly! At the end of the game, your total score will determine how well you've navigated your career path.</p>
            <div className="career-buttons-container">
              <button onClick={() => handleCareerSelection('lawyer')} className="career-button">
                Lawyer
              </button>
              <button onClick={() => handleCareerSelection('doctor')} className="career-button">
                Doctor
              </button>
              <button onClick={() => handleCareerSelection('pilot')} className="career-button">
                Pilot
              </button>
              <button onClick={() => handleCareerSelection('ethicalHacker')} className="career-button">
                Ethical Hacker
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Render the selected career RPG */}
            {renderCareerRPG()}
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerSelection;
