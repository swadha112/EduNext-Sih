import React, { useState } from 'react';
import axios from 'axios';

function Chatbot() {
  const [sessionId, setSessionId] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('English');
  const [isSessionInitialized, setIsSessionInitialized] = useState(false);
  const [sessionChoice, setSessionChoice] = useState('1'); // '1' for new session, '2' for existing session
  const [existingSessionId, setExistingSessionId] = useState(''); // Session ID input for loading

  const initializeSession = async () => {
    try {
      const response = await axios.post('http://localhost:5050/api/chatbot/chat', {
        session_id: '',
        message: sessionChoice === '1' ? 'start' : 'load',
        language: language,
        existing_session_id: sessionChoice === '2' ? existingSessionId : ''
      });

      if (response.data.session_id) {
        setSessionId(response.data.session_id);
        setIsSessionInitialized(true);
        setMessages([
          { sender: 'ai', text: `Your session ID is: ${response.data.session_id}. You can use this ID to continue your conversation later.` }
        ]);
      } else {
        setMessages([
          { sender: 'ai', text: "Session could not be initialized. Please try again." }
        ]);
      }
    } catch (error) {
      console.error("Error initializing session:", error);
      setMessages([
        { sender: 'ai', text: "Sorry, something went wrong while starting the session. Please try again." }
      ]);
    }
  };

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = input.trim();
      setMessages([...messages, { sender: 'user', text: userMessage }]);
      setInput('');

      if (isSessionInitialized && sessionId) {
        try {
          const response = await axios.post('http://localhost:5050/api/chatbot/chat', {
            session_id: sessionId,
            message: userMessage,
            language: language
          });

          setMessages(messages => [
            ...messages,
            { sender: 'ai', text: response.data.response }
          ]);
        } catch (error) {
          console.error("Error sending message:", error);
          setMessages(messages => [
            ...messages,
            { sender: 'ai', text: "Sorry, something went wrong. Please try again." }
          ]);
        }
      } else {
        setMessages(messages => [
          ...messages,
          { sender: 'ai', text: "Session is not initialized. Please start or load a session." }
        ]);
      }
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleSessionChoiceChange = (e) => {
    setSessionChoice(e.target.value);
  };

  const handleExistingSessionIdChange = (e) => {
    setExistingSessionId(e.target.value);
  };

  const startSession = () => {
    if (sessionChoice === '1' || (sessionChoice === '2' && existingSessionId.trim())) {
      initializeSession();
    } else if (sessionChoice === '2' && !existingSessionId.trim()) {
      setMessages(messages => [
        ...messages,
        { sender: 'ai', text: "Please enter a valid session ID to load a previous session." }
      ]);
    }
  };

  return (
    <div className="chatbot">
      {!isSessionInitialized ? (
        <>
          <div className="chat-controls">
            <label>Select Language:</label>
            <select value={language} onChange={handleLanguageChange}>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="German">German</option>
              <option value="French">French</option>
              <option value="Bengali">Bengali</option>
            </select>
            <label>Choose Session:</label>
            <select value={sessionChoice} onChange={handleSessionChoiceChange}>
              <option value="1">Start a new session</option>
              <option value="2">Load an existing session</option>
            </select>
            {sessionChoice === '2' && (
              <input
                type="text"
                placeholder="Enter your session ID"
                value={existingSessionId}
                onChange={handleExistingSessionIdChange}
              />
            )}
            <button onClick={startSession}>Start</button>
          </div>
          <div className="chat-window">
            {messages.map((msg, index) => (
              <div key={index} className={msg.sender === 'user' ? 'user-message' : 'ai-message'}>
                {msg.text}
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}

export default Chatbot;
