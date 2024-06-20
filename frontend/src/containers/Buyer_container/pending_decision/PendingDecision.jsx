import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router
import './pendingdecision.css';
import PulseLoader from 'react-spinners/PulseLoader';

import AuthContext from '../../../context/Authcontext';

function PendingDecision() {
  const [tendersData, setTendersData] = useState(null);
  const { authTokens } = useContext(AuthContext);

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const response = await fetch('http://localhost:8000/get_tenders?status=pending_decision', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authTokens.access}`,
          },
        });

        const data = await response.json();
        setTendersData(data);
      } catch (error) {
        console.error('Error fetching tenders:', error);
      }
    };

    fetchTenders();
  }, [authTokens]);

  // Remove expandedTender state, as we will use useParams to track tender details
  if (!tendersData) {
    return (
      <div>
        <PulseLoader
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
            width: '135vh' }}
          color="#77E6FD"
          size="20"
        />
      </div>
    );
  }
  return (
    <div className="pending-container">
      <div className="gradient__text pending_title">
        <h1 className="first_title">العروض المقدمة</h1>
      </div>
      {tendersData && tendersData.length === 0 && (
        <div style={{ alignItems: 'center', textAlign: 'center', marginTop: '100px' }}>
          <p className="national" style={{ alignItems: 'center', textAlign: 'center' }}>لا توجد مناقصات في هذه المرحلة بعد</p>
        </div>
      )}
      {tendersData && tendersData.map((tender, index) => (
        <Link style={{ 'text-decoration': 'none' }} key={index} to={`/tender_responses/${tender.id}`}>
          <div className="tender-card">
            <h1 className="tender-title gradient__text">
              {tender.ad?.title}
            </h1>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default PendingDecision;
