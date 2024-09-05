import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Container,
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import './Chatbot.css'; // Include the bouncing dots CSS here

function Chatbot() {
  const [messages, setMessages] = useState([]); // State to store messages
  const [input, setInput] = useState(''); // State to store user input
  const [loading, setLoading] = useState(false); // Loading state for AI response
  const websocketRef = useRef(null); // Reference to WebSocket connection
  const chatBoxRef = useRef(null); // Reference to chat box for auto scroll
  // User data from local storage
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // Establish WebSocket connection when the component mounts
    const socket = new WebSocket('ws://localhost:8000/ws/start'); // Replace with your actual WebSocket URL

    // Store the WebSocket reference
    websocketRef.current = socket;

    socket.onopen = () => {
      console.log('WebSocket connected');

      // Send the user's profile information to initialize the context
      const initMessage = JSON.stringify({
        type: 'initialize_context',
        payload: user,
      });

      // Send the invisible message to the server
      websocketRef.current.send(initMessage);
    };

    socket.onmessage = (event) => {
      setLoading(false); // Hide loading state when AI message is received
      const aiMessage = event.data;

      // Directly add the full AI message when it's received
      setMessages((prevMessages) => [
        ...prevMessages,
        { from: 'ai', message: aiMessage, animation: 'pop-in' },
      ]);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);

  // Auto-scroll to the bottom when messages or loading state changes
  useEffect(() => {
    if (chatBoxRef.current) {
      setTimeout(() => {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }, 100); // Allow some time for content to render before scrolling
    }
  }, [messages, loading]);

  const handleSend = () => {
    if (input.trim() && websocketRef.current) {
      const userMessage = input.trim();
      setMessages((prevMessages) => [
        ...prevMessages,
        { from: 'user', message: userMessage, animation: 'pop-in' },
      ]);
      setInput('');
      websocketRef.current.send(userMessage);

      // Set loading state while waiting for the AI response
      setLoading(true);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        height: '90%', // Full height for the chat window
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: 2,
          marginTop: 4,
        }}
      >
        <Box
          ref={chatBoxRef} // Use this ref to auto-scroll the chat container
          sx={{
            flex: 1,
            overflowY: 'auto', // Enable vertical scrolling
            padding: 2,
            backgroundColor: '#f5f5f5',
            maxHeight: '70vh', // Limit height so it becomes scrollable when content overflows
          }}
        >
          {messages.map((msg, index) => (
            <Box
              key={index}
              className={msg.animation} // Add the pop-in class for the animation
              sx={{
                display: 'flex',
                justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start',
                mb: 1,
              }}
            >
              {msg.from === 'user' ? (
                <Typography
                  variant="body1"
                  component="div"
                  sx={{
                    padding: '10px',
                    borderRadius: '10px',
                    backgroundColor: '#1976d2',
                    color: 'white',
                    maxWidth: '75%',
                    marginBottom: '1rem',
                  }}
                >
                  {msg.message}
                </Typography>
              ) : (
                <Box
                  sx={{
                    padding: '10px',
                    borderRadius: '10px',
                    backgroundColor: '#e0e0e0',
                    color: 'black',
                    maxWidth: '75%',
                    marginBottom: '1rem',
                  }}
                >
                  {/* Render AI messages using ReactMarkdown */}
                  <ReactMarkdown>{msg.message}</ReactMarkdown>
                </Box>
              )}
            </Box>
          ))}
          {loading && (
            <Box
              className="bouncing-dots" // Add class for the bouncing dots container
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                mb: 1,
              }}
            >
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </Box>
          )}
        </Box>
        <Box sx={{ display: 'flex', padding: 1 }}>
          <TextField
            variant="outlined"
            fullWidth
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSend();
              }
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSend}
            sx={{ marginLeft: 1 }}
          >
            Send
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Chatbot;
