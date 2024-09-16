const twilio = require("twilio");
const User = require("../models/userModel");

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

exports.handleWhatsAppWebhook = async (req, res) => {
  try {
    // Extract data from the webhook payload
    const { Body } = req.body;
    const [status, email] = Body.split("\n"); // Extract status and email

    // Check if the email is present
    if (!email) {
      return res
        .status(400)
        .json({ message: "Invalid email in the message body" });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prepare the notification message based on status
    let notificationMessage = "";
    if (status.toLowerCase() === "approve") {
      notificationMessage =
        "Congratulations! Your counselor request has been approved.";
    } else if (status.toLowerCase() === "deny") {
      notificationMessage = "Sorry, your counselor request has been rejected.";
    } else {
      notificationMessage = "Unknown status received from WhatsApp.";
    }

    // Add the notification to the user's notifications array
    user.notifications.push({
      message: notificationMessage,
      isRead: false,
    });

    // Save the user with the new notification
    await user.save();

    res.status(200).json({ message: "Notification added successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
