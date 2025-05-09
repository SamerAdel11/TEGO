import React, { useState, useContext } from 'react';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import { Link } from 'react-router-dom'; // Import Link
import logo from '../../assets/Logo4.png';
import './navbar.css';
import AuthContext from '../../context/Authcontext';

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="gpt3__navbar">
      <div className="gpt3__navbar-links">
        <div className="gpt3__navbar-links_logo">
          <img src={logo} alt="logo" />
        </div>
        <div className="gpt3__navbar-links_container">
          <p><Link style={{ 'text-decoration': 'none' }} to="/">الرئيسية</Link></p>
          <p><a href="#wgpt3">ما هو TEGO ؟</a></p>
          <p><a href="#features">لماذا TEGO ؟</a></p>
          <p><a href="#possibility">العمل المستقبلي</a></p>
          <p><a href="#blog">الخاتمة</a></p>
        </div>
      </div>
      {!user ? (
        <div className="gpt3__navbar-sign">
          <Link style={{ 'text-decoration': 'none' }} to="/signin">
            <p type="btn">تسجيل الدخول</p>
          </Link>
          {/* Use Link here */}
          <Link style={{ 'text-decoration': 'none' }} to="/sign"><button type="button">انشاء حساب جديد</button></Link>
        </div>
      ) : (
        <div>
          <button type="button" onClick={logout}>تسجيل خروج</button>
        </div>
      )}
      <div className="gpt3__navbar-menu">
        {toggleMenu
          ? <RiCloseLine color="#fff" size={27} onClick={() => setToggleMenu(false)} />
          : <RiMenu3Line color="#fff" size={27} onClick={() => setToggleMenu(true)} />}
        {toggleMenu && (
        <div className="gpt3__navbar-menu_container scale-up-center">
          <div className="gpt3__navbar-menu_container-links">
            <p><Link style={{ 'text-decoration': 'none' }} to="/">Home</Link></p>
            <p><a href="#wgpt3">ما هو TEGO ؟</a></p>
            <p><a href="#features">لماذا TEGO ؟</a></p>
            <p><a href="#possibility">العمل المستقبلي</a></p>
            <p><a href="#blog">الخاتمة</a></p>
          </div>
          <div className="gpt3__navbar-menu_container-links-sign">
            <p>تسجيل الدخول</p>
            {/* Use Link here */}
            <Link style={{ 'text-decoration': 'none' }} to="/signup"><button type="button">انشاء حساب جديد</button></Link>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
