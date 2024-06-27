/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SidebarItem from './SidebarItem';
import items from './sidebar.json';
import './sidebar.css';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/add_response' || location.pathname === '/tender_offer') {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
    }
  }, [location.pathname]);

  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleItemClick = () => {
    if (isCollapsed) {
      setIsCollapsed(false);
    }
  };

  return (
    <div style={{ overflow: 'hidden' }} className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="collapse-button" onClick={handleCollapseToggle}>
        <i className="bi bi-list" />
      </button>
      <div>
        {items.map((item, index) => (
          <SidebarItem key={index} item={item} isCollapsed={isCollapsed} onItemClick={handleItemClick} />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
