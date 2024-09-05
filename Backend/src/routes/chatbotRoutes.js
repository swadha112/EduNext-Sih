const express = require("express");
const { PythonShell } = require("python-shell");
const path = require("path");

const router = express.Router();

router.post("/chat", (req, res) => {
  const { session_id, message, language } = req.body;

  const options = {
    scriptPath: path.join(__dirname, "../../backend"), // Ensure this path points correctly to your `chatbot.py` file
    args: [JSON.stringify({ session_id, message, language })],
  };

  PythonShell.run("chatbot.py", options, (err, results) => {
    if (err) {
      console.error("Error running Python script:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    try {
      const response = JSON.parse(results[0]);
      return res.json(response);
    } catch (parseError) {
      console.error("Error parsing response:", parseError);
      return res.status(500).json({ error: "Error parsing response from Python script" });
    }
  });
});

module.exports = router;
