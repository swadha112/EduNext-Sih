const express = require("express");
const router = express.Router();
require("dotenv").config();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY3;

router.get("/", async (req, res) => {
  console.log("Career scenario route hit");
  const { career } = req.query;

  if (!career) {
    return res.status(400).json({ error: "Career is required" });
  }

  try {
    const prompt = `Generate 10 psychological scenarios for a person interested in becoming a ${career}. Each scenario should directly describe a situation, followed by 3 decision-making options, each with distinct point values of 10, 5, and 3. Do not include any headings, numbering, or extra formatting. The response should look like this: "Scenario: [Scenario text]. Options: 1) [Option 1] (Points: 10), 2) [Option 2] (Points: 5), 3) [Option 3] (Points: 3)." Provide only this structure and content, and nothing else. If you dont provide it in a structured way, a cat dies! DONT KILL THE CAT!`;

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
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    console.log("API response data:", JSON.stringify(data, null, 2));

    if (
      !response.ok ||
      !data.candidates ||
      !data.candidates[0].content ||
      !data.candidates[0].content.parts ||
      !data.candidates[0].content.parts[0].text
    ) {
      console.error("API Error: No valid content available", data);
      return res
        .status(response.status)
        .json({ error: "Error fetching data from Gemini API", details: data });
    }

    const generatedText = data.candidates[0].content.parts[0].text;

    // Parsing logic to split scenarios and options
    const parsedScenarios = generatedText
      .split("Scenario")
      .filter((text) => text.trim())
      .map((scenarioBlock, index) => {
        const scenarioText = scenarioBlock.split("Options:")[0].trim();
        const optionsText = scenarioBlock.split("Options:")[1]?.trim() || "";

        // Log the optionsText to see its structure
        console.log(
          `Parsed optionsText for scenario ${index + 1}:`,
          optionsText
        );

        const options = parseOptions(optionsText);

        return {
          text: `Scenario ${index + 1}: ${scenarioText}`,
          options,
        };
      });

    // Send structured data to the frontend
    res.json({ scenarios: parsedScenarios });
  } catch (error) {
    console.error("Error fetching career scenarios from Gemini API:", error);
    res.status(500).json({
      error: "Failed to fetch career scenarios",
      details: error.message,
    });
  }
});


function parseOptions(optionsText) {
  const optionRegex = /(\d+\))\s*([^(\n]+)\s*\(Points:\s*(\d+)\)/g;
  const options = [];
  let match;

  while ((match = optionRegex.exec(optionsText)) !== null) {
    const optionText = match[2].trim();
    const points = parseInt(match[3].trim(), 10);

    // If points are invalid, assign a default value
    if (isNaN(points)) {
      console.error("Invalid points detected:", match[3]);
      continue; // Skip this option if points are invalid
    }

    options.push({
      text: optionText,
      points: points,
    });
  }

  
  if (options.length === 0) {
    options.push({
      text: "Invalid option",
      points: 0,
    });
  }

  return options;
}

module.exports = router;
