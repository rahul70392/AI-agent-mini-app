import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {v4 as uuidv4} from 'uuid';

function App() {
  const [userMessage, setUserMessage] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Initialize Telegram Web App
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.expand();
      const user = window.Telegram.WebApp.initDataUnsafe?.user;
      if (user) {
        setUserId(user.id);
      }
    }
  }, []);

  const handleSendMessage = async () => {
    if (!userMessage.trim()) {
      alert('Please enter a message.');
      return;
    }

    try {
      const payload = {
        user_id: userId || 'anonymous',
        sessionId: uuidv4(),
        message: userMessage,
      };

      const response = await axios.post(process.env.REACT_APP_N8N_WEBHOOK_URL, payload);
      console.log("respo---------------->", response);
      setResponseMessage(response.data.output || 'No response from AI agent');
      setUserMessage('');
    } catch (error) {
      console.error('Error communicating with webhook:', error);
      setResponseMessage('Error contacting AI Agent. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <h1>StrikeBit AI Agent</h1>
      <input
        style={styles.input}
        type="text"
        placeholder="Ask me anything..."
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
      />
      <button style={styles.button} onClick={handleSendMessage}>
        Send
      </button>
      <div style={styles.response}>
        <strong>Response:</strong> {responseMessage}
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    padding: '20px',
  },
  input: {
    padding: '10px',
    margin: '10px 0',
    width: '80%',
    maxWidth: '400px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
  response: {
    marginTop: '20px',
    fontSize: '14px',
    color: '#333',
  },
};

export default App;
