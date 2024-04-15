import React, { useState, useContext } from 'react';
import { Navbar } from '../../components';
import AuthContext from '../../context/Authcontext';

import './signIn.css';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext); // Destructure loginUser from the context
  // const { getNotification, Notification } = useContext(AuthContext); // Destructure loginUser from the context

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Call loginUser function from the context
    const formData = {
      email: '',
      password: '',
    };
    formData.email = e.target.email.value;
    formData.password = e.target.password.value;
    login(formData); // Pass the event object to the loginUser function
  };

  return (
    <>
      <Navbar />
      <div className="container_signin">
        <div>
          <div className="gradient__text">
            <h1>تسجيل الدخول</h1>
          </div>
          <form onSubmit={handleSubmit}> {/* Use handleSubmit for form submission */}
            <div>
              <label htmlFor="email">
                البريد الالكتروني:
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
              </label>
            </div>
            <div>
              <label htmlFor="password">
                كلمة السر:
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
              </label>
            </div>
            <button className="button_signin" type="submit">تسجيل الدخول</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default SignIn;
