const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const newsRoutes = require("./routes/newsRoutes");
const counselorsRoutes = require("./routes/counsellorRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const quizRoutes = require("./routes/quizRoutes");
const alumniRoutes = require("./routes/alumniRoutes");
const videoRoutes = require("./routes/videoRoutes");
const workshopRoutes = require("./routes/workshopRoutes");
const whatsappRoutes = require("./routes/whatsappRoutes");
const careerScenarioRoutes = require("./routes/careerScenarioRoutes");
const twilio = require("twilio");

dotenv.config(); // Load environment variables

// Connect to MongoDB
connectDB();

// Initialize the Express app
const app = express();

// Middleware to parse JSON and handle CORS
app.use(cors());
app.use(express.json());

const accountSid = "ACec9289616130f5e2c8b297081a310ff4";
const authToken = "a06f450772e9799b3c78f53274f9c879";
const client = new twilio(accountSid, authToken);

app.post("/send-whatsapp", async (req, res) => {
  try {
    const { to, clientName, email, bio } = req.body; // Get 'to', 'clientName', 'email', and 'bio' from request body

    // Send WhatsApp template message
    const messageResponse = await client.messages.create({
      from: "whatsapp:+14155238886", // Twilio WhatsApp number
      to: `whatsapp:${to}`, // Recipient's WhatsApp number

      contentSid: "HXfba5e71251df373f471ac64ff5913d5d", // Your Template SID
      contentVariables: JSON.stringify({
        1: `${clientName}`, // Replaces {{1}} in the template
        2: `${email}`, // Replaces {{2}} in the template
        3: `${bio}`, // Replaces {{3}} in the template
      }),
    });

    // Success response
    res.status(200).json({
      status: "success",
      data: messageResponse,
    });
  } catch (error) {
    // Error handling
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});
// Define routes
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/users", userRoutes); // User-related routes
app.use("/api/news", newsRoutes); // News-related routes
app.use("/api/counselors", counselorsRoutes); // Counselors-related routes
app.use("/api/chatbot/chat", chatbotRoutes); // Chatbot-related routes
app.use("/api/quiz", quizRoutes); // Quiz-related routes
app.use("/api/alumni", alumniRoutes); // Alumni-related routes
app.use("/api/video", videoRoutes); // Video-related routes
app.use("/api/workshop", workshopRoutes);
app.use("/api/whatsapp", whatsappRoutes);
app.use("/api/career-scenarios", careerScenarioRoutes);
// Health Check Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Global error handler (optional but useful)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "An internal server error occurred.",
    error: err.message,
  });
});

// 404 handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Export the app to be used in server.js
module.exports = app;
