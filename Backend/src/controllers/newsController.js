// src/controllers/newsController.js

const axios = require('axios');

const getNews = async (req, res) => {
  const domain = req.query.domain || 'Technology';
  const apiKey = process.env.NEWS_API_KEY;

  try {
    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=${domain}+job+market&apiKey=${apiKey}`
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
};

module.exports = { getNews };
