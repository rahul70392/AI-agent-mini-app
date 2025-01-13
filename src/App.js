import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import {Navbar} from "./components/Navbar"
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';


function App() {
  const [userMessage, setUserMessage] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [userId, setUserId] = useState(null);
  const [responseLoading, setResponseLoading] = useState(false);
  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

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
      setResponseLoading(true);
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
    } finally {
      setResponseLoading(false);
    }
  };

  const handleCloseToast = () => {
    setToast(false);
  }

  const action = (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseToast}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );
  
  return (
    <div
      className='container'
    >
      <img
        src='/strikebit.png'
        alt=''
      />
      <h1
        className='textSize'
      >
        STRIKEBIT
        <br />
        <span
          className='textBlue'
        >
          AI AGENT
        </span>
      </h1>
      <input
        className='input'
        type="text"
        placeholder="Ask me anything..."
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
      />
      <button
        className='button'
        onClick={handleSendMessage}
      >
        Send
      </button>
      <div
        className='response'
      >
        {
          responseLoading ?
            <div className='response-loader-container'>Loading <div className="loader"></div></div>
            : responseMessage ?
              <>
                Response: {responseMessage}
              </>
              : <></>
        }
      </div>

      <Navbar setToast={setToast} setToastMessage={setToastMessage}/>

      <Snackbar
        open={toast}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        message={toastMessage}
        action={action}
      />
    </div>
  );
}

export default App;
