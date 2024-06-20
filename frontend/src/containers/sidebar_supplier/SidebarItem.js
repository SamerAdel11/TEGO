import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './sidebar.css';

const SidebarItem = ({ item, isCollapsed, onItemClick }) => {
  const [open, setOpen] = useState(false);

  const handleItemClick = () => {
    if (item.childrens && item.childrens.length > 0) {
      setOpen(!open);
    }
    onItemClick(); // Notify parent Sidebar component to expand
  };

  if (item.childrens && item.childrens.length > 0) {
    return (
      <div className={open ? 'sidebar-item open' : 'sidebar-item'}>
        <div className="sidebar-title" onClick={handleItemClick}>
          <span>
            {item.icon && <i className={item.icon} />}
            {!isCollapsed && item.title}
          </span>
          {!isCollapsed && (
            <i className="bi-chevron-down toggle-btn" />
          )}
        </div>
        <div className="sidebar-content">
          {item.childrens.map((child, index) => (
            <SidebarItem key={index} item={child} isCollapsed={isCollapsed} onItemClick={onItemClick} />
          ))}
        </div>
      </div>
    );
  }
  if (item.childrens && item.childrens.length === 0) {
    return (
      <Link to={item.path || '#'} className="sidebar-item sidebar-title" onClick={onItemClick}>
        <span>
          {item.icon && <i className={item.icon} />}
          {!isCollapsed && item.title}
        </span>
      </Link>
    );
  }

  return (
    <Link to={item.path || '#'} className="sidebar-item plain" onClick={onItemClick}>
      <span>
        {item.icon && <i className={item.icon} />}
        {!isCollapsed && item.title}
      </span>
    </Link>
  );
};

export default SidebarItem;
