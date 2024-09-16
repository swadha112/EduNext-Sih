const express = require('express');
const router = express.Router();
const fetch = (...args) => import('node-fetch').then(module => module.default(...args));
require('dotenv').config();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY2;

router.get('/', async (req, res) => {
  console.log('Career scenario route hit');
  const { career } = req.query;

  if (!career) {
    return res.status(400).json({ error: 'Career is required' });
  }

  try {
    const prompt = `Generate 15 psychological scenarios for a person interested in becoming a ${career}. Each scenario should directly describe a situation, followed by 3 decision-making options, each with distinct point values of 10, 5, and 3. Do not include any headings, numbering, or extra formatting. The response should look like this: "Scenario: [Scenario text]. Options: 1) [Option 1] (Points: 10), 2) [Option 2] (Points: 5), 3) [Option 3] (Points: 3)." Provide only this structure and content, and nothing else.`;

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

    if (!response.ok || !data.candidates || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0].text) {
      console.error('API Error: No valid content available', data);
      return res.status(response.status).json({ error: 'Error fetching data from Gemini API', details: data });
    }

    const generatedText = data.candidates[0].content.parts[0].text;

    // Parsing logic to split scenarios and options
    const parsedScenarios = generatedText.split('Scenario').filter(text => text.trim()).map((scenarioBlock, index) => {
      const scenarioText = scenarioBlock.split('Options:')[0].trim();
      const optionsText = scenarioBlock.split('Options:')[1]?.trim() || '';

      const options = optionsText.split(',').map((option, idx) => {
        const parts = option.trim().split('(Points:');
        return {
          text: parts[0].trim(),
          points: parseInt(parts[1].replace(')', '').trim(), 10),
        };
      });

      return {
        text: `Scenario ${index + 1}: ${scenarioText}`,
        options
      };
    });

    // Send structured data to the frontend
    res.json({ scenarios: parsedScenarios });
  } catch (error) {
    console.error('Error fetching career scenarios from Gemini API:', error);
    res.status(500).json({ error: 'Failed to fetch career scenarios', details: error.message });
  }
});

module.exports = router;
