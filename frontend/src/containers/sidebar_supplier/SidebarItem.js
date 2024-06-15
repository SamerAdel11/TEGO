import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function SidebarItem({ item }) {
  const [open, setOpen] = useState(false);

  if (item.childrens && item.childrens.length > 0) {
    return (
      <div className={open ? 'sidebar-item open' : 'sidebar-item'}>
        <div className="sidebar-title">
          <span>
            {item.icon && <i className={item.icon} />}
            {item.title}
          </span>
          <i
            className="bi-chevron-down toggle-btn"
            onClick={() => setOpen(!open)}
          />
        </div>
        <div className="sidebar-content">
          {item.childrens.map((child, index) => (
            <SidebarItem key={index} item={child} />
          ))}
        </div>
      </div>
    );
  }
  if (item.childrens && item.childrens.length === 0) {
    return (
      <Link to={item.path || '#'}>
        <div className="sidebar-item sidebar-title">
          <span>
            {item.icon && <i className={item.icon} />}
            {item.title}
          </span>
        </div>
      </Link>

    );
  }
  return (
    <Link to={item.path || '#'} className="sidebar-item plain">
      {item.icon && <i className={item.icon} />}
      {item.title}
    </Link>
  );
}

