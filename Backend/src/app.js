const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());  // Middleware to parse JSON

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Export app to be used in the server.js file
module.exports = app;
