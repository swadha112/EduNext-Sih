const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

// Load environment variables
dotenv.config();

// MongoDB Server
const mongoApp = express();
const MONGO_PORT = process.env.MONGO_PORT || 5000;

// Connect to MongoDB
connectDB();

mongoApp.listen(MONGO_PORT, () => {
    console.log(`MongoDB server running on port ${MONGO_PORT}`);
});

// News API Server
const newsApp = express();
const NEWS_PORT = process.env.NEWS_PORT || 5001;

newsApp.use(cors());
newsApp.use(express.json());

// News route
newsApp.get('/news', async (req, res) => {
    const domain = req.query.domain || 'Technology';
    const apiKey = process.env.NEWS_API_KEY;

    try {
        const response = await axios.get(`https://newsapi.org/v2/everything?q=${domain}+job+market&apiKey=${apiKey}`);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
});

newsApp.listen(NEWS_PORT, () => {
    console.log(`News API server running on port ${NEWS_PORT}`);
});
