const express = require("express");
const axios = require("axios");

const router = express.Router();

// Replace with your actual SerpAPI key
const serpapiApiKey = "5ad21298a4582514fab6ea04eca448994fc1b9ab0dc3e88ce76588bcd28d5b52";

// Extract the 6-digit pincode from the address
const extractPincode = (address) => {
  const pincodeMatch = address.match(/\b\d{6}\b/);
  return pincodeMatch ? pincodeMatch[0] : null;
};

// Function to search for career counselors via SerpAPI (Google API)
const searchWeb = async (query, numResults = 5) => {
  const params = {
    engine: "google",
    q: query,
    num: numResults,
    api_key: serpapiApiKey,
  };

  const response = await axios.get("https://serpapi.com/search", { params });
  const results = response.data;
  return results.organic_results.map(result => ({
    url: result.link,
    snippet: result.snippet || "",
    title: result.title || "",
  }));
};

// Generate a Google Maps search link based on the location
const generateMapsLink = (location) => {
  const encodedLocation = encodeURIComponent(location);
  return `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
};

router.post("/", async (req, res) => {
  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ error: "Address is required." });
  }

  const pincode = extractPincode(address);

  if (!pincode) {
    return res.status(400).json({ error: "Invalid address. Pincode not found." });
  }

  try {
    const query = `career counsellors near ${pincode}`;
    const searchResults = await searchWeb(query, 5);

    const contents = searchResults.map(result => ({
      url: result.url,
      title: result.title,
      maps_link: generateMapsLink(`${result.title} ${pincode}`),
    }));

    res.json(contents);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch counselors." });
  }
});

module.exports = router;
