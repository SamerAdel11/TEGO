import React, { useContext, useState, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import logo from '../../assets/Logo4.png';

import './navbarHost.css';
import AuthContext from '../../context/Authcontext';
import CustomNotifications from '../navbar/notification/Notifications';

function Navbar() {
  const { logout, user } = useContext(AuthContext);
  const [supplierView, setSupplierView] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hideText, setHideText] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const history = useHistory();
  const location = useLocation();
  console.log(location.pathname);

  useEffect(() => {
    const savedState = localStorage.getItem('supplierView');
    console.log('saved stats is ', localStorage.getItem('supplierView'));
    if (savedState !== null) {
      setSupplierView(JSON.parse(savedState));
    } else {
      setSupplierView(true);
    }
  }, []);

  useEffect(() => {
    if (isAnimating) {
      const newSupplierView = !supplierView;
      console.log('Supplier view is ', supplierView);

      const timer = setTimeout(() => {
        setSupplierView(newSupplierView);
        localStorage.setItem('supplierView', JSON.stringify(newSupplierView));
        setIsAnimating(false);
        setShowNotification(true);
      }, 100); // Ensure this duration matches the CSS animation duration

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isAnimating, supplierView]);

  const handleClick = () => {
    setHideText(true);
    setIsAnimating(true);
  };

  useEffect(() => {
    if (showNotification) {
      const targetPath = supplierView ? '/open_tenders' : '/mytender';
      const timer = setTimeout(() => {
        history.push(targetPath);
      }, 200);

      // Cleanup the timer if the component unmounts or if the effect runs again
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [showNotification, supplierView, history]);

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
      {(supplierView !== null
      && user) && user.company_type === 'supplier' ? (
        <div className={`toggle-button ${supplierView ? 'active' : ''}`} onClick={handleClick}>
          {supplierView && supplierView ? (
            <span className={`toggle-text ${isAnimating ? 'fade-out' : 'fade-in'}`}>{!hideText && 'مورد'}</span>
          ) : (
            <span style={{ marginRight: '40px' }} className={`toggle-text ${isAnimating ? 'fade-out' : 'fade-in'}`}>{!hideText && 'مُعلِن'}</span>
          )}
          <span className="toggle-circle" />
        </div>
        ) : (
          <div className="toggle-button-buyer">
            <span style={{ textAlign: 'center' }} className="toggle-text">{!hideText && 'مُعلِن'}</span>
          </div>
        )}

      <div>
        <button style={{ width: '100%', background: '' }} onClick={logout} type="button">تسجيل الخروج</button>
      </div>
    </div>
  );
}

export default Navbar;
