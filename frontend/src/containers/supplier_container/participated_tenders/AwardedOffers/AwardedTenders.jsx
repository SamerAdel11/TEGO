import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router
import './AwardedTenders.css';
import AuthContext from '../../../../context/Authcontext';

function AwardedTenders() {
  const [tendersData, setTendersData] = useState(null);
  const { authTokens } = useContext(AuthContext);

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const response = await fetch('http://localhost:8000/get_tenders_supplier?responsestatus=awarded', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authTokens.access}`,
          },
        });

        const data = await response.json();
        setTendersData(data);
        console.log(data);
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
        <h1 className="first_title">المناقصات الفائزه</h1>
      </div>
      {tendersData && tendersData.map((tender, index) => (
        <Link style={{ 'text-decoration': 'none' }} key={index} to={`/tender_offer?tender_id=${tender.id}`}>
          <div className="tender-cards">
            <h1 className="tender-title gradient__text">
              {tender.ad?.title}
            </h1>
            <p className="topic">{tender.ad.topic}</p>

            <h2> اخر موعد لتقديم العروض {tender.ad?.deadline} </h2>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default AwardedTenders;
