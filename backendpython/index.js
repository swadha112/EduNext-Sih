const axios = require('axios');

async function sendMessageToChatbot(message, language = "English") {
    try {
        const response = await axios.post('http://localhost:8000/chat', {
            message: message,
            language: language
        });
        console.log('Response from FastAPI:', response.data);
    } catch (error) {
        console.error('Error calling FastAPI:', error.response ? error.response.data : error.message);
    }
}

// Example usage
sendMessageToChatbot('I need career advice.');
