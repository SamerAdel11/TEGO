import React, { useState } from 'react';
import './file.css'; // Import your CSS file for sidebar styling

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button type="button" className="toggle-btn" onClick={toggleSidebar}>
        Toggle Sidebar
      </button>
      <div className="content">
        <h2>Name</h2>
        <p>Your Name</p>
        <h2>Email</h2>
        <p>Your Email</p>
        <h2>Transportation</h2>
        <p>Your Transportation</p>
      </div>
    </div>
  );
};

export default Sidebar;
