const express = require("express");
const { sendWhatsAppMessage } = require("../controllers/whatsappController");

const router = express.Router();

// Route to send a WhatsApp message
router.post("/send-whatsapp", sendWhatsAppMessage);

module.exports = router;
