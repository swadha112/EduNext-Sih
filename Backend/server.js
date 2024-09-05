const dotenv = require("dotenv");
const app = require("./src/app");
const connectDB = require("./src/config/db");

dotenv.config();

// Connect to MongoDB
connectDB();

const PORT = 5050;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




// News API Server
// const newsApp = express();
// const NEWS_PORT = process.env.NEWS_PORT || 5001;

// newsApp.use(cors());
// newsApp.use(express.json());

// // News route
// newsApp.get("/news", async (req, res) => {
//   const domain = req.query.domain || "Technology";
//   const apiKey = process.env.NEWS_API_KEY;

//   try {
//     const response = await axios.get(
//       `https://newsapi.org/v2/everything?q=${domain}+job+market&apiKey=${apiKey}`
//     );
//     res.json(response.data);
//   } catch (error) {
//     console.error("Error fetching news:", error);
//     res.status(500).json({ error: "Failed to fetch news" });
//   }
// });

// newsApp.listen(NEWS_PORT, () => {
//   console.log(`News API server running on port ${NEWS_PORT}`);
// });
