import React, { useState } from 'react';
import { Navbar } from '../../components';
import './signIn.css';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://your-django-server-url/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        // Sign-in successful, you may redirect the user or perform other actions
        console.log('Sign-in successful');
      } else {
        // Sign-in failed, handle the error response accordingly
        const data = await response.json();
        console.error('Sign-in failed:', data.error);
      }
    } catch (error) {
      console.error('Error occurred while signing in:', error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container_signin">
        <div>
          <div className="gradient__text">
            <h1>تسجيل الدخول</h1>
          </div>
          <form onSubmit={handleSubmit}>
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
            <button className="button_signin" type="submit">تسجل الدخول</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default SignIn;
