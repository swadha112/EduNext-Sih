const express = require('express');
const router = express.Router();
//const fetch = require('node-fetch'); // For making HTTP requests
const fetch = (...args) => import('node-fetch').then(module => module.default(...args));
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY2; // Load the API key


router.get('/', async (req, res) => {
  console.log('Career scenario route hit');
  const { career } = req.query;
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
    console.log('API response data:', JSON.stringify(data, null, 2));

    // Extract the generated text from content.parts[0].text
    if (!response.ok || !data.candidates || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0].text) {
      console.error('API Error: No valid content available', data);
      return res.status(response.status).json({ error: 'Error fetching data from Gemini API', details: data });
    }

    const generatedText = data.candidates[0].content.parts[0].text;

    // Generate scenarios based on the text
    const scenarios = generatedText.split('\n\n').map((scenarioText, index) => ({
      text: scenarioText,
      // details: 'Detailed explanation for scenario...',
      // impact: 'The impact of making this choice...',
      options: [
        { text: 'Option 1', points: 10 },
        { text: 'Option 2', points: 5 },
        { text: 'Option 3', points: 3 },
      ],
    }));

    res.json({ scenarios });
  } catch (error) {
    console.error('Error fetching career scenarios from Gemini API:', error);
    res.status(500).json({ error: 'Failed to fetch career scenarios', details: error.message });
  }
});

module.exports = router;
