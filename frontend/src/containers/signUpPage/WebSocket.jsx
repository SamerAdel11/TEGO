import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../../context/Authcontext';

const WebSocketExample = () => {
  const [messages, setMessages] = useState([]);
  const { authTokens } = useContext(AuthContext); // Destructure loginUser from the context
  // WebSocketManager component responsible for managing WebSocket communication and state
  useEffect(() => {
    const url = `ws://localhost:8000/ws/notify/?token=${authTokens.access}`;
    console.log(url);
    const ws = new WebSocket(url);
    ws.onmessage = (event) => {
      console.log('there is a message');
      const data = JSON.parse(event.data);
      console.log(data.message);
      setMessages((prevMessages) => [...prevMessages, data.message]);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    };
  }, []);

  // MessageList component responsible for rendering the received messages
  const MessageList = ({ prevMessages }) => (
    <ul>
      { prevMessages.map((message, index) => (
        <li key={index}>{message} </li>
      ))}
    </ul>
  );

  return (
    <div>
      <h1>Welcome to WebSocket Example</h1>
      <MessageList prevMessages={messages} />
    </div>
  );
};

export default WebSocketExample;
