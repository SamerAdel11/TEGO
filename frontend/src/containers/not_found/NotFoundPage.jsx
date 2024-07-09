/* eslint-disable no-use-before-define */
import React from 'react';
// import { Link } from 'react-router-dom';

// eslint-disable-next-line arrow-body-style
const NotFoundPage = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>404</h1>
      <p style={styles.paragraph}>
        الصفحة التي تبحث عنها غير موجودة
      </p>
      {/* <Link to="/" style={styles.link}>
        Go back to the homepage
      </Link> */}
    </div>
  );
};

const styles = {

  container: {
    textAlign: 'center',
    marginTop: '50px',
  },
  header: {
    fontSize: '200px',
    marginBottom: '20px',
    textAlign: 'center',

  },
  paragraph: {
    fontSize: '35px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  link: {
    fontSize: '18px',
    color: '#007bff',
    textDecoration: 'none',
    textAlign: 'center',

  },
};

export default NotFoundPage;
