const express = require("express");
const axios = require("axios");

const router = express.Router();

// Replace with your actual SerpAPI key
const serpapiApiKey = "5ad21298a4582514fab6ea04eca448994fc1b9ab0dc3e88ce76588bcd28d5b52";

// Function to search for alumni via SerpAPI (Google API)
const searchAlumni = async (query, numResults = 5) => {
  const params = {
    engine: "google",
    q: query,
    num: numResults,
    api_key: serpapiApiKey,
  };

  const response = await axios.get("https://serpapi.com/search", { params });
  const results = response.data;
  return results.organic_results.map(result => ({
    name: result.title || "",
    linkedin_link: result.link,
    snippet: result.snippet || "",
  }));
};

router.post("/", async (req, res) => {
  const { universityName } = req.body;

  if (!universityName) {
    return res.status(400).json({ error: "University name is required." });
  }

  try {
    const query = `site:linkedin.com/in AND "${universityName}" alumni`;
    const searchResults = await searchAlumni(query, 5);

    const contents = searchResults.map(result => ({
      name: result.name.split(' - ')[0], // Attempt to extract name from the title
      linkedin_link: result.linkedin_link,
      university_name: universityName
    }));

    res.json(contents);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch alumni information." });
  }
});

module.exports = router;
