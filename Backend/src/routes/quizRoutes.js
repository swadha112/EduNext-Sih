const express = require("express");
const axios = require("axios");

const router = express.Router();

// Function to call Google Gemini API to generate questions
const generateQuestionsWithGemini = async (prompt, apiKey) => {
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const headers = {
    'Content-Type': 'application/json',
  };
  const data = {
    "contents": [
      {
        "role": "user",
        "parts": [{"text": prompt}]
      }
    ]
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log("API Response JSON:", response.data); // Log for debugging
    return response.data;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};

// Helper function to recommend subjects based on answers
const recommendSubjects = (answers) => {
  const subjects = { 'Mathematics': 0, 'Science': 0, 'Art': 0, 'Literature': 0, 'Sports': 0 };

  answers.forEach(answer => {
    const answerLower = answer.toLowerCase();
    if (answerLower.includes('math')) subjects['Mathematics'] += 1;
    else if (answerLower.includes('science')) subjects['Science'] += 1;
    else if (answerLower.includes('art') || answerLower.includes('draw') || answerLower.includes('paint')) subjects['Art'] += 1;
    else if (answerLower.includes('read') || answerLower.includes('write') || answerLower.includes('book')) subjects['Literature'] += 1;
    else if (answerLower.includes('sport') || answerLower.includes('game')) subjects['Sports'] += 1;
  });

  return Object.entries(subjects)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([subject]) => subject);
};

// Route to generate questions using Gemini API
router.post("/generate-questions", async (req, res) => {
  const { name, profession, interests, hobbies, experience, dob } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;  // Load your API key from environment variables

  const initialPrompt = (
    `Generate five questions based on the following user information:\n` +
    `Name: ${name}\n` +
    `Profession: ${profession}\n` +
    `Interests: ${interests.join(', ')}\n` +
    `Hobbies: ${hobbies.join(', ')}\n` +
    `Experience: ${experience}\n` +
    `Date Of Birth: ${dob}`
  );

  try {
    const geminiResponse = await generateQuestionsWithGemini(initialPrompt, apiKey);
    const questionsText = geminiResponse['candidates'][0]['content']['parts'][0]['text'];
    const initialQuestions = questionsText.split('\n').filter(q => q.trim() !== '');
    res.json({ questions: initialQuestions });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate questions." });
  }
});

// Route to recommend subjects based on answers
router.post("/recommend-subjects", (req, res) => {
  const { answers } = req.body;

  try {
    const recommendedSubjects = recommendSubjects(answers);
    res.json({ recommendedSubjects });
  } catch (error) {
    console.error("Error recommending subjects:", error);
    res.status(500).json({ error: "Failed to recommend subjects." });
  }
});

module.exports = router;
