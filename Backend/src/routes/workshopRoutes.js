// src/routes/searchRoutes.js
const express = require("express");
const axios = require("axios");

const router = express.Router();

// Replace this with your actual SerpApi key
const serpapiApiKey = process.env.SERPAPI_API_KEY || "5ad21298a4582514fab6ea04eca448994fc1b9ab0dc3e88ce76588bcd28d5b52";

// Web search function
const searchWeb = async (domain, city, numResults = 5) => {
    const params = {
      engine: "google",
      q: `${domain} ${city}`,
      num: numResults,
      hl: "en",
      google_domain: "google.com",
      location: city,
      api_key: serpapiApiKey,
    };
  
    const serpApiUrl = "https://serpapi.com/search";
    const response = await axios.get(serpApiUrl, { params });
    const results = response.data;
  
    // Log the results to see the structure of placesResults
    console.log("SerpAPI Results:", results);
  
    const organicResults = results.organic_results || [];
    const placesResults = results.local_results || [];
  
    // Ensure placesResults is an array before mapping
    const mapLinks = Array.isArray(placesResults)
      ? placesResults.map(place => ({
          name: place.title,
          google_maps_link: place.gps_coordinates,
        }))
      : [];
  
    const siteLinks = organicResults.map(result => ({
      url: result.link,
      snippet: result.snippet || "",
    }));
  
    return { siteLinks, mapLinks };
  };
  

// API endpoint
router.post("/search", async (req, res) => {
  try {
    const { domain, city } = req.body;
    const searchResults = await searchWeb(domain, city, 5);

    res.json({
      success: true,
      data: searchResults,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the data.",
    });
  }
});

module.exports = router;
