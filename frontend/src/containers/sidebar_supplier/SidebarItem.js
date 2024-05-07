import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function SidebarItem({ item }) {
  const [open, setOpen] = useState(false);

  if (item.childrens) {
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
  return (
    <Link to={item.path || '#'} className="sidebar-item plain">
      {item.icon && <i className={item.icon} />}
      {item.title}
    </Link>
  );
}

