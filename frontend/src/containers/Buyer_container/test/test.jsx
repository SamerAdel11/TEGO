/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';

const MyForm = () => {
  const [testData, settestData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    settestData({
      ...testData,
      [name]: value,
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!testData.name) newErrors.name = 'Name is required';
    if (!testData.email) newErrors.email = 'Email is required';
    if (!testData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = (e, type) => {
    e.preventDefault();
    if (type === 'publish') {
      const validationErrors = validate();
      if (Object.keys(validationErrors).length === 0) {
        console.log('Form published:', testData);
      } else {
        setErrors(validationErrors);
      }
    } else {
      console.log('Form saved as draft:', testData);
    }
  };

  return (
    <form>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={testData.name}
          onChange={handleChange}
        />
        {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={testData.email}
          onChange={handleChange}
        />
        {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={testData.password}
          onChange={handleChange}
        />
        {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
      </div>
      <button type="button" onClick={(e) => handleSubmit(e, 'draft')}>
        Save as Draft
      </button>
      <button type="button" onClick={(e) => handleSubmit(e, 'publish')}>
        Publish
      </button>
    </form>
  );
};

export default MyForm;
