import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { Address } from '@ton/core';

function App() {
  const [tonConnectUI] = useTonConnectUI();
  const [tonWalletAddress, setTonWalletAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userMessage, setUserMessage] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [userId, setUserId] = useState(null);
  const [responseLoading, setResponseLoading] = useState(false);

  const handleWalletConnection = useCallback((address) => {
    setTonWalletAddress(address);
    console.log("Wallet Connected Successfully!");
    setIsLoading(false);
  }, [])

  const handleWalletDisconnection = useCallback(() => {
    setTonWalletAddress(null);
    console.log("Wallet Disconnected Successfully!");
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (tonConnectUI.account?.address) {
        handleWalletConnection(tonConnectUI.account?.address);
      } else {
        handleWalletDisconnection();
      }
    };
    checkWalletConnection();

    const unsubscribe = tonConnectUI.onStatusChange((wallet) => {
      if (wallet) {
        handleWalletConnection(wallet.account.address)
      } else {
        handleWalletDisconnection();
      }
    });

    return(() => {
      unsubscribe();
    });

  }, [tonConnectUI, handleWalletConnection, handleWalletDisconnection]);

  const handleWalletAction = async () => {
    if (tonConnectUI.connected) {
      setIsLoading(true);
      await tonConnectUI.disconnect();
    } else {
      await tonConnectUI.openModal();
    }
  }

  const formatAddress = (address) => {
    const tempAddress = Address.parse(address).toString();
    return `${tempAddress.slice(0,4)}...${tempAddress.slice(-4)}`;
  }

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

  if(isLoading) return <div>Loading...</div>

  return (
    <div
      className='container'
    >
      <div className='wallet-button'>
        {
          tonWalletAddress ?
          <div>
            <p>Connected: {formatAddress(tonWalletAddress)}</p>
            <button
              onClick={handleWalletAction}
            >
              Disconnect Wallet
            </button>
          </div>
          : <button
            onClick={handleWalletAction}
            className='connect-wallet-button'
          >
            Connect Ton Wallet
          </button>
        }
      </div>
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
            <div className='response-loader-container'>Loading <div class="loader"></div></div>
            : responseMessage ?
              <>
                Response: {responseMessage}
              </>
              : <></>
        }
      </div>
    </div>
  );
}

export default App;
