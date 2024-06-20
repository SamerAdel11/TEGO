/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/button-has-type */
import React, { useState, useEffect, useContext } from 'react';
import PulseLoader from 'react-spinners/PulseLoader';
import AuthContext from '../../../context/Authcontext';

function SupplierContracts() {
  const [contractData, setContractData] = useState(null);
  const { authTokens } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await fetch('http://localhost:8000/list_transactions?user_type=supplier', {
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

  const downloadContract = async (transaction) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/contract/${transaction.tender}/${transaction.response}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authTokens.access}`,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'contract.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      setLoading(false);
    } catch (error) {
      console.error('Error downloading the PDF:', error);
      setLoading(false);
    }
  };

  // Remove expandedTender state, as we will use useParams to track tender details
  if (!contractData) {
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
        <h1 className="first_title">العقود</h1>
      </div>
      {contractData.length === 0 && (
        <div style={{ alignItems: 'center', textAlign: 'center', marginTop: '100px' }}>
          <p className="national" style={{ alignItems: 'center', textAlign: 'center' }}>لا يوجد عقود بعد</p>
        </div>
      )}
      {contractData && contractData.map((transaction, index) => (
        <a
          style={{ 'text-decoration': 'none', padding: '0px', background: 'transparent', border: 'none', borderColor: 'transparent' }}
          key={index}
          onClick={() => downloadContract(transaction)}
        >
          <div className="tender-cards">
            <h1 className="tender-title gradient__text">
              عقد مناقصة {transaction?.tender_title}
            </h1>
            <div className="center-content">
              <p className="national" style={{ padding: '0px', fontSize: 'small' }}>{ loading && 'جاري التحميل...' }</p>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}

export default SupplierContracts;
