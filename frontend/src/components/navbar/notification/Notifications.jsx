// src/components/Notifications.js

import React, { useState, useEffect, useContext } from 'react';
import './Notifications.css';
import notificationIcon from '../../../assets/notification_icon(light_blue).png';
import AuthContext from '../../../context/Authcontext';

const Notifications = ({ iconColor }) => {
  // Sample notifications data
  // const [notifications, setNotifications] = useState([
  //   {
  //     id: 1,
  //     message:
  //       'Congratulations your offer has been awarded to the candidate pool stage.',
  //     seen: false,
  //   },
  //   {
  //     id: 2,
  //     message: 'Unfortunately your offer has been rejected from the tender.',
  //     seen: false,
  //   },
  //   { id: 3, message: 'You have a new message from the admin.', seen: true },
  // ]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { authTokens } = useContext(AuthContext); // Destructure loginUser from the context
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const url = `ws://localhost:8000/ws/notify/?token=${authTokens.access}`;

    const ws = new WebSocket(url);
    ws.onmessage = (event) => {
      console.log('there is a message');
      const data = JSON.parse(event.data);
      console.log(data);

      setMessages((prevMessages) => [data, ...prevMessages]);
      console.log(messages);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    };
  }, []);

  const unseenCount = messages.filter(
    (messagess) => !messagess.seen,
  ).length;

  const MakeNotificationSeen = async () => {
    try {
      const response = await fetch(`http://localhost:8000/make_notifications_seen/?count=${unseenCount}`, { // Fetch first 10 unseen notifications
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to update notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markTopUnseenAsSeen = () => {
    setMessages((prevMessages) => {
      let unseenProcessed = 0;
      return prevMessages.map((message) => {
        if (!message.seen && unseenProcessed < unseenCount) {
          unseenProcessed += 1;
          return { ...message, seen: true };
        }
        return message;
      });
    });
  };
  // Function to toggle dropdown
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    if (!dropdownOpen) {
      console.log('LOL');
      MakeNotificationSeen();
      // markTopUnseenAsSeen();
    }
    if (dropdownOpen) {
      markTopUnseenAsSeen();
    }
  };
  const MessageList = ({ prevMessages }) => (
    <ul className="notification-drop">
      { prevMessages.map((message, index) => (
        <li key={index} style={{ backgroundColor: !message.seen && '#3a5068' }} className="notification-item">{message.message} </li>
      ))}
    </ul>
  );
  // Function to mark notifications as seen

  return (
    <div className="notifications-container">
      <div
        className="notification-icon"
        onClick={toggleDropdown}
        style={{ color: iconColor, marginRight: '20px' }}
      >
        {/* eslint-disable-next-line global-require */}
        <img src={notificationIcon} alt="Notification Icon" style={{ width: '30px', height: '30px' }} />
        {unseenCount > 0 && <span className="unseen-count">{unseenCount}</span>}
      </div>
      {dropdownOpen && (
        <div className="notification-dropdown">
          <MessageList prevMessages={messages} />
        </div>
      )}
    </div>
  );
};

export default Notifications;
