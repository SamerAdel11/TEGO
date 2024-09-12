/* eslint-disable no-unused-vars */
import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { Navbar } from '../../components';
import AuthContext from '../../context/Authcontext';

import './signIn.css';

function SignIn() {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext); // Destructure loginUser from the context
  const [errorMessage, setErrorMessage] = useState(''); // State for error message

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
      passWord: '',
    };
    formData.email = e.target.email.value;
    formData.passWord = e.target.password.value;
    const response = await login(formData);
    if (response.status === 401) {
      setErrorMessage('لا يوجد حساب بهذه البيانات');
    } else if (response.status !== 200) {
      setErrorMessage(response.message);
    }
  };
  const GoogleAuth = async () => {
    // const response = await fetch('http://localhost:8000/google_login', {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // });
    // const data = await response.json();
    // console.log(data.url);
    // if (response.ok) {
    //   console.log('response is ', data.url);
    //   window.location.href = data.url;
    // }
    window.location.href = 'https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=749857093501-ehv1dipdc73kp2mfbhbv8elq7b9avsqo.apps.googleusercontent.com&redirect_uri=http://localhost:3000/google_auth&scope=openid email profile&access_type=offline&prompt=consent';
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
            {errorMessage && <div style={{ color: 'red', fontSize: 'x-large' }} className="error-message">{errorMessage}</div>} {/* Display error message */}
            <button className="button_signin" type="submit">تسجيل الدخول</button>
            {/* <button className="button_signin" type="button" onClick={GoogleAuth}>Google</button> */}

          </form>
        </div>
      </div>
    </>
  );
}

export default SignIn;
