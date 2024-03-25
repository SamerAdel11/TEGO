import React from 'react';
// import { Link } from 'react-router-dom'; // Import Link
import './hostHome.css';

function HostHome() {
  return (
    <>
      <div className="host-home-container">
        <div className="host_home">
          <h1 className="gradient__text">الصفحة الرئيسية</h1>
          <label htmlFor="search">
            ابحث
            <input
              type="text"
              id="search"
              placeholder="Search..."
              className="search-input"
            />
            <button type="submit" className="search-button">
              بحث
              <i className="fa fa-search" />
            </button>
          </label>
        </div>
        <hr data-v-7e013592 className="full-width" />
        <h1 className="gradient__text">الاشعارات</h1>
      </div>
    </>
  );
}

export default HostHome;
