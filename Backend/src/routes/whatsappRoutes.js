const express = require("express");
const { sendWhatsAppMessage } = require("../controllers/whatsappController");

const router = express.Router();

// Route to send a WhatsApp message
router.post("/send-whatsapp", sendWhatsAppMessage);
router.post("/webhook", (req, res) => {
  console.log("Incoming WhatsApp message:", req.body); // Log the request body

  // Send a 200 OK response to Twilio to acknowledge receipt
  res.status(200).send("Webhook received!");
});

module.exports = router;
