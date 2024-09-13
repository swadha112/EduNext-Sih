const express = require('express');
const router = express.Router();
const fetch = require('node-fetch'); // For making HTTP requests
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY2; // Load the API key

router.get('/', async (req, res) => {
  console.log('Career scenario route hit');
  const { career } = req.query; // Capture the career parameter
  console.log(`Career: ${career}`);

  if (!career) {
    return res.status(400).json({ error: 'Career is required' });
  }

  try {
    const prompt = `You are a career counselor. I want you to generate 15 psychological scenarios for a person interested in becoming a ${career}. Each scenario should include a decision the person needs to make in their career path. Present 3 options for each decision, each option with different point values, and explain how the choice impacts their career. At the end, provide feedback on how well the person would perform in the ${career} career based on their decisions.`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    };

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    const data = await response.json();
    
    console.log('API Response:', data); // Log the entire response
    
    if (!response.ok || !data.generatedText) {
      console.error('API Error:', data);
      throw new Error(`Error fetching data from Gemini API: ${response.statusText}`);
    }
    

    const scenarios = [
      {
        text: data.generatedText || `We couldn't generate a personalized scenario for ${career}, but here is a generic exploration scenario.`,
        options: [
          { text: 'Option 1', points: 10 },
          { text: 'Option 2', points: 5 },
          { text: 'Option 3', points: 3 },
        ],
      },
    ];
    

    res.json({ scenarios });
  } catch (error) {
    console.error('Error fetching career scenarios from Gemini API:', error);
    res.status(500).json({ error: 'Failed to fetch career scenarios' });
  }
});

module.exports = router;
