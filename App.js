import React, { useState, useEffect, useRef } from 'react';
import './App.css'; // Import our custom styles

const WEBSOCKET_URL = 'wss://art05rhea2.execute-api.us-east-1.amazonaws.com/prod/'; // Replace with your actual URL

function App() {
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    socketRef.current = new WebSocket(WEBSOCKET_URL);

    socketRef.current.onopen = () => {
      console.log('Connected to WebSocket');
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setChatLog(prev => [...prev, data.message]);
    };

    socketRef.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => socketRef.current.close();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog]);

  const sendMessage = () => {
    if (socketRef.current && message.trim() !== '') {
      socketRef.current.send(JSON.stringify({
        action: 'sendMessage',
        message: message,
      }));
      setMessage('');
    }
  };

  return (
    <div className="app">
      <div className="chat-container">
        <h2 className="title">💬 Live Chat</h2>
        <div className="chat-box">
          {chatLog.map((msg, idx) => (
            <div key={idx} className="chat-bubble">{msg}</div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="input-area">
          <input
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Type a message"
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
