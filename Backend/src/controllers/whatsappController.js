const twilio = require("twilio");

const accountSid =
  process.env.TWILIO_ACCOUNT_SID || "ACec9289616130f5e2c8b297081a310ff4";
const authToken =
  process.env.TWILIO_AUTH_TOKEN || "a06f450772e9799b3c78f53274f9c879";
const client = new twilio(accountSid, authToken);

// Controller function to send a WhatsApp message
exports.sendWhatsAppMessage = async (req, res) => {
  try {
    const { to, clientName, email, bio } = req.body; // Destructure the request body

    // Send the WhatsApp template message
    const messageResponse = await client.messages.create({
      from: "whatsapp:+14155238886", // Twilio WhatsApp number
      to: `whatsapp:${to}`, // Recipient's WhatsApp number
      contentSid: "HXfba5e71251df373f471ac64ff5913d5d", // Template SID
      contentVariables: JSON.stringify({
        1: `${clientName}`, // Replace {{1}} in the template
        2: `${email}`, // Replace {{2}} in the template
        3: `${bio}`, // Replace {{3}} in the template
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
};
