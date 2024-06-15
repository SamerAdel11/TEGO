import React, { useContext, useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import logo from '../../assets/Logo4.png';

import './navbarHost.css';
import AuthContext from '../../context/Authcontext';
import CustomNotifications from '../navbar/notification/Notifications';

function Navbar() {
  const { logout, user } = useContext(AuthContext);
  const [supplierView, setSupplierView] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hideText, setHideText] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const savedState = localStorage.getItem('supplierView');
    if (savedState !== null) {
      setSupplierView(JSON.parse(savedState));
    } else {
      setSupplierView(JSON.parse(true));
    }
  }, []);

  useEffect(() => {
    let timer;
    if (isAnimating) {
      const newSupplierView = !supplierView;
      timer = setTimeout(() => {
        setSupplierView(newSupplierView);
        localStorage.setItem('supplierView', JSON.stringify(newSupplierView));
        // history.push(newSupplierView ? '/open_tenders' : '/mytender');
        setIsAnimating(false);
      }, 400);
      setTimeout(() => {
        history.push(supplierView ? '/open_tenders' : '/mytender');
      }, 200); // Ensure this duration matches the CSS animation duration
    }
    return () => clearTimeout(timer);
  }, [isAnimating, supplierView, history]);

  const handleClick = () => {
    setHideText(true);
    setIsAnimating(true);
  };

  return (
    <div className="gpt3__navbar">
      <div className="gpt3__navbar-links">
        <div className="gpt3__navbar-links_logo">
          <Link style={{ textDecoration: 'none' }} to="/">
            <img src={logo} alt="logo" />
          </Link>
        </div>
        <div className="gpt3__navbar-links_container">
          <CustomNotifications />
        </div>
      </div>
      {supplierView !== null
      && user && user.company_type === 'supplier' && (
        <div className={`toggle-button ${supplierView ? 'active' : ''}`} onClick={handleClick}>
          {supplierView ? (
            <span className={`toggle-text ${isAnimating ? 'fade-out' : 'fade-in'}`}>{!hideText && 'مورد'}</span>
          ) : (
            <span style={{ marginRight: '40px' }} className={`toggle-text ${isAnimating ? 'fade-out' : 'fade-in'}`}>{!hideText && 'بائع'}</span>
          )}
          <span className="toggle-circle" />
        </div>
      )}

      <div>
        <button style={{ width: '100%', background: '' }} onClick={logout} type="button">تسجيل الخروج</button>
      </div>
    </div>
  );
}

export default Navbar;
