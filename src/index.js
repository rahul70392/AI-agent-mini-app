import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { Buffer } from 'buffer';
if (!window.Buffer) {
  window.Buffer = Buffer;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TonConnectUIProvider manifestUrl='https://raw.githubusercontent.com/prince-1908/strikebit-mini-app-ton-meta-data/refs/heads/main/strikebit-mini-app-ton-meta-data.json?token=GHSAT0AAAAAACYX3E46HIW5RSS2IGQA5FLKZ34EVLQ'>
      <App />
    </TonConnectUIProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
