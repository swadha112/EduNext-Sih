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

module.exports = router;
