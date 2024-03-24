import React from 'react';
import { Icon } from '@material-ui/core';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import './toSign.css';
import { Link } from 'react-router-dom'; // Import Link
import '../../components/navbar/navbar.css';
import logo from '../../assets/Logo4.png';

function ToSign() {
  return (
    <>
      <div className="gpt3__navbar">
        <div className="gpt3__navbar-links">
          <div className="gpt3__navbar-links_logo">
            <img src={logo} alt="logo" />
          </div>
          <div className="gpt3__navbar-links_container">
            <p>
              <Link to="/">الرئيسية</Link>
            </p>
          </div>
        </div>
        <div className="gpt3__navbar-sign">
          <Link to="/signin">
            <p type="btn">انشاء حساب جديد</p>
          </Link>
          {/* Use Link here */}
          <Link to="/sign">
            <button type="button">انشاء حساب جديد</button>
          </Link>
        </div>
      </div>
      <div className="container supplier-signUp">
        <div className="card">
          <h1 className="gradient__text">سجل كمشتري</h1>
          <div className="icon">
            <Icon component={LocalMallOutlinedIcon} fontSize="large" />
          </div>
          <div className="p-container">
            <p className="p-content">يمكنك التسجيل علي المنصة الان كمشتري</p>
          </div>
          <Link to="/signup2">
            <button type="button" className="submit_button">
              سجل الان
            </button>
          </Link>
        </div>
        <div className="card">
          <h1 className="gradient__text">سجل كمورد</h1>
          <div className="icon">
            <Icon component={LocalShippingIcon} fontSize="large" />
          </div>
          <div className="p-container">
            <p className="p-content">يمكنك التسجيل علي المنصة الان كمورد</p>
          </div>
          <Link to="/signup">
            <button type="button" className="submit_button">
              سجل الان
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default ToSign;
