import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router
import AuthContext from '../../context/Authcontext';

function OpenTenders() {
  const [contractData, setContractData] = useState(null);
  const { authTokens } = useContext(AuthContext);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await fetch('http://localhost:8000/get_tenders_supplier', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authTokens.access}`,
          },
        });

        const data = await response.json();
        setContractData(data);
      } catch (error) {
        console.error('Error fetching tenders:', error);
      }
    };

    fetchContracts();
  }, [authTokens]);

  // Remove expandedTender state, as we will use useParams to track tender details

  return (
    <div className="pending-container">
      <div className="gradient__text pending_title">
        <h1 className="first_title">العقود</h1>
      </div>
      {contractData && contractData.map((transaction, index) => (
        <Link style={{ 'text-decoration': 'none' }} key={index} to={`/add_response?tender_id=${6}`}>
          <div className="tender-cards">
            <h1 className="tender-title gradient__text">
              {transaction.tender.ad.title?.title}
            </h1>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default OpenTenders;
