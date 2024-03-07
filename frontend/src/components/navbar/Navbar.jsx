import React, { useState } from 'react';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import { Link } from 'react-router-dom'; // Import Link
import logo from '../../assets/Logo4.png';
import './navbar.css';

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);

  return (
    <div className="gpt3__navbar">
      <div className="gpt3__navbar-links">
        <div className="gpt3__navbar-links_logo">
          <img src={logo} alt="logo" />
        </div>
        <div className="gpt3__navbar-links_container">
          <p><Link to="/">الرئيسية</Link></p>
          <p><a href="#wgpt3">ما هو TEGO ؟</a></p>
          <p><a href="#features">لماذا TEGO ؟</a></p>
          <p><a href="#possibility">العمل المستقبلي</a></p>
          <p><a href="#blog">الخاتمة</a></p>
        </div>
      </div>
      <div className="gpt3__navbar-sign">
        <p>تسجيل الدخول</p>
        {/* Use Link here */}
        <Link to="/signup"><button type="button">انشاء حساب جديد</button></Link>
      </div>
      <div className="gpt3__navbar-menu">
        {toggleMenu
          ? <RiCloseLine color="#fff" size={27} onClick={() => setToggleMenu(false)} />
          : <RiMenu3Line color="#fff" size={27} onClick={() => setToggleMenu(true)} />}
        {toggleMenu && (
        <div className="gpt3__navbar-menu_container scale-up-center">
          <div className="gpt3__navbar-menu_container-links">
            <p><Link to="/">Home</Link></p>
            <p><a href="#wgpt3">ما هو TEGO ؟</a></p>
            <p><a href="#features">لماذا TEGO ؟</a></p>
            <p><a href="#possibility">العمل المستقبلي</a></p>
            <p><a href="#blog">الخاتمة</a></p>
          </div>
          <div className="gpt3__navbar-menu_container-links-sign">
            <p>تسجيل الدخول</p>
            {/* Use Link here */}
            <Link to="/signup"><button type="button">انشاء حساب جديد</button></Link>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
