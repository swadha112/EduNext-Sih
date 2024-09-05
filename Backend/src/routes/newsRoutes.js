// src/routes/newsRoutes.js

const express = require("express");
const router = express.Router();
const { getNews } = require("../controllers/newsController");

// Define the route for fetching news
router.get("/", getNews);

module.exports = router;
