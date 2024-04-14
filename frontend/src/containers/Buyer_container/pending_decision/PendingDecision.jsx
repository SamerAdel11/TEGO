import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router
import './pendingdecision.css';

function PendingDecision() {
  return (
    <div>
      <div className="gradient__text mytender">
        <h1 className="first_title">المناقصات المنشورة</h1>
      </div>
      <Link to="/candidates" className="button">تجمع المرشحين</Link>
      <Link to="/responses" className="button">الردود</Link>
      {/* Add your third Link here */}
    </div>
  );
}

export default PendingDecision;
