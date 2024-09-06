// src/components/Workshops.jsx
import React, { useState } from "react";
import axios from "axios";

const Workshops = () => {
  const [domain, setDomain] = useState("");
  const [city, setCity] = useState("");
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5050/api/workshop/search", {
        domain,
        city,
      });
      if (response.data.success) {
        setResults(response.data.data);
        setError("");
      } else {
        setError("No results found");
      }
    } catch (err) {
      setError("Error fetching search results");
    }
  };

  return (
    <div>
      <h2>Search for Career Workshops</h2>
      <form onSubmit={handleSearch}>
        <div>
          <label>Career Domain:</label>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="Enter career domain"
          />
        </div>
        <div>
          <label>City:</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city"
          />
        </div>
        <button type="submit">Search</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {results && (
        <div>
          <h3>Web Results</h3>
          <ul>
            {results.siteLinks.map((result, index) => (
              <li key={index}>
                <a href={result.url} target="_blank" rel="noopener noreferrer">
                  {result.url}
                </a>
                <p>{result.snippet}</p>
              </li>
            ))}
          </ul>

          <h3>Google Maps Results</h3>
          <ul>
            {results.mapLinks.map((place, index) => (
              <li key={index}>
                {place.name} -{" "}
                <a
                  href={`https://www.google.com/maps?q=${place.google_maps_link.latitude},${place.google_maps_link.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on Google Maps
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Workshops;
