import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router
import './CandidatePool.css';
import AuthContext from '../../../context/Authcontext';

function CandidatePool() {
  const [tendersData, setTendersData] = useState(null);
  const { authTokens } = useContext(AuthContext);

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const response = await fetch('http://localhost:8000/get_tenders', {
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

  return (
    <div className="pending-container">
      <div className="gradient__text pending_title">
        <h1 className="first_title">طلبات التاكيد</h1>
      </div>
      {tendersData && tendersData.map((tender, index) => (
        <Link key={index} to={`/candidate_responses/${tender.id}`}>
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

export default CandidatePool;
