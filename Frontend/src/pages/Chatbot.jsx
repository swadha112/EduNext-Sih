import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Chatbot() {
  const [sessionId, setSessionId] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('English');

  useEffect(() => {
    // Initialize a new session when the component mounts
    axios.post('/api/chatbot/chat', {
      session_id: sessionId,  // Empty at first to create a new session
      message: "start",
      language: language
    })
    .then(response => {
      setSessionId(response.data.session_id);  // Assume backend sends session_id in response
    })
    .catch(error => {
      console.error("Error starting session:", error);
    });
  }, [language]);  // Reinitialize session if language changes

  const handleSend = () => {
    if (input.trim()) {
      const userMessage = input.trim();
      setMessages([...messages, { sender: 'user', text: userMessage }]);
      setInput('');

      axios.post('/api/chatbot/chat', {
        session_id: sessionId,
        message: userMessage,
        language: language
      })
      .then(response => {
        setMessages(messages => [
          ...messages,
          { sender: 'user', text: userMessage },
          { sender: 'ai', text: response.data.response }
        ]);
      })
      .catch(error => {
        console.error("Error sending message:", error);
        setMessages(messages => [
          ...messages,
          { sender: 'ai', text: "Sorry, something went wrong. Please try again." }
        ]);
      });
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  return (
    <div className="chatbot">
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender === 'user' ? 'user-message' : 'ai-message'}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
      <div className="chat-controls">
        <select value={language} onChange={handleLanguageChange}>
          <option value="English">English</option>
          <option value="Hindi">Hindi</option>
          <option value="German">German</option>
          <option value="French">French</option>
          <option value="Bengali">Bengali</option>
        </select>
      </div>
    </div>
  );
}

export default Chatbot;
