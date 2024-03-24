import React from 'react';
import SidebarItem from './SidebarItem';
import items from './sidebar.json';
import './sidebar.css';

export default function Sidebar() {
  return (
    <>
      <div className="main">
        <div className="sidebar">
          {items.map((item, index) => (
            <SidebarItem key={index} item={item} />
          ))}
        </div>
        {/* this will deleted later  */}
        {/* <div className="container_sidebar">
          <h1 className="title">My React App</h1>
          <p className="info">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          <button type="button" className="btn_sidebar">Explore now</button>
        </div> */}
      </div>
    </>
  );
}
