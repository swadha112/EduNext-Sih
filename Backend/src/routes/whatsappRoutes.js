const express = require("express");
const {
  sendWhatsAppMessage,
  handleWhatsAppWebhook,
} = require("../controllers/whatsappController");

const router = express.Router();

// Route to send a WhatsApp message
router.post("/send-whatsapp", sendWhatsAppMessage);

router.post("/webhook", handleWhatsAppWebhook);

module.exports = router;
