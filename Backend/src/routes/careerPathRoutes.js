require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use the API key from the environment variable
});

// Function to generate career paths using GPT-4O Mini
const generateCareerPaths = async (areaOfStudy) => {
  try {
    const prompt = `
    Generate a comprehensive career path tree based on the following area of study: "${areaOfStudy}". 
    The tree should include main career paths and their respective sub-paths.
    Provide the output in a nested JSON format where each career path has a name and an array of sub_paths. 
    Each node should have at least 3 levels of sub_paths.
    The final level of sub-paths should contain job titles, skills, tools, or any other related information.
    Each node should have the following structure:
    GIVE ME PLAIN TEXT ONLY , IF YOU DONT GIVE PLAIN TEXT YOU KILL A CAT, DONT KILL THE CAT
    ALSO DONT GIVE MARKDOWN
    {
        "name": "Career Name",
        "sub_paths": [
            {
                "name": "Sub Career Name",
                "sub_paths": [
                    {
                        "name": "Sub Career Name Level 2",
                        "sub_paths": [
                            {
                                "name": "Sub Career Name Level 3",
                                "sub_paths": []
                            }
                        ]
                    }
                ]
            }
        ]
    }
  `;
    console.log("Sending prompt to OpenAI:", prompt); // Log the prompt to check

    // Send the prompt to OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using the GPT-4O Mini model
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
    });

    console.log("OpenAI Response:", response); // Log the full response to inspect

    // Ensure the response contains the expected format
    if (!response || !response.choices || !response.choices[0].message) {
      throw new Error("Unexpected response structure from OpenAI.");
    }

    const content = response.choices[0]?.message?.content.trim();

    if (content) {
      try {
        const careerTree = JSON.parse(content); // Parse the response as JSON
        return careerTree;
      } catch (error) {
        console.error("Error parsing response as JSON:", error.message);
        throw new Error("Failed to parse career paths.");
      }
    } else {
      console.error("Empty response content from OpenAI API.");
      throw new Error("Empty response content from OpenAI API.");
    }
  } catch (error) {
    console.error("Error generating career paths:", error.message);
    throw new Error("Failed to generate career paths.");
  }
};

// Route to generate the career path tree
router.post("/", async (req, res) => {
  const { areaOfStudy } = req.body;

  if (!areaOfStudy) {
    return res
      .status(400)
      .json({ error: "Please provide an areaOfStudy in the request body." });
  }

  try {
    // Step 1: Generate career paths using GPT-4O Mini
    const careerTree = await generateCareerPaths(areaOfStudy);

    // Step 2: Return the generated career tree as JSON
    res.json(careerTree);
  } catch (error) {
    // Handle errors by sending a response with the error message
    console.error("Error during career path generation:", error.message); // Additional logging for debugging
    res.status(500).json({ error: error.message });
  }
});

//hi

module.exports = router;
 //careerPathRoutes.js
