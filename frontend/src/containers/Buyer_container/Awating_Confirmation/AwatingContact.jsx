import React, { useState, useEffect, useContext } from 'react';
import './AwatingContact.css';
import { useParams, Link } from 'react-router-dom';
import AuthContext from '../../../context/Authcontext';

function AwatingContact() {
  const { id } = useParams();
  console.log('معرف العطاء:', id);
  const [responseDetails, setResponseDetails] = useState(null);
  const { authTokens } = useContext(AuthContext);

  const handleSendResponse = async (tender, nationalID) => { // Modified handleSendResponse to accept nationalID parameter
    try {
      const status = 'candidate_pool';
      const response = await fetch(
        `http://localhost:8000/update_response/${tender.id}/`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authTokens.access}`,
          },
          body: JSON.stringify({ status, nationalID }), // Include national ID in the request body
        },
      );

      const data = await response.json();
      console.log('Response sent:', data);
      window.location.reload();
    } catch (error) {
      console.error('Error sending response:', error);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchTenderDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/get_responses/?tender_id=${id}&status=candidate_pool`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authTokens.access}`,
            },
          },
        );

        const data = await response.json();
        console.log('تفاصيل العطاء:', data);

        if (isMounted) {
          setResponseDetails(data);
        }
      } catch (error) {
        console.error('خطأ في جلب تفاصيل العطاء:', error);
      }
    };

    fetchTenderDetails();

    return () => {
      isMounted = false;
    };
  }, [id, authTokens.access]);

  const [nationalID, setNationalID] = useState(''); // Moved nationalID declaration here

  const handleNationalIDChange = (event) => { // Added function to handle changes in the national ID input field
    setNationalID(event.target.value);
  };

  return (
    <div className="tender-details-container">
      <div className="center-content">
        <div className="gradient__text mytender">
          <h1 className="first_title">جميع الردود</h1>
        </div>

      </div>
    </div>
  );
}

export default AwatingContact;
