// /* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
import './my_tender.css';
import { useHistory, Link } from 'react-router-dom';
import PulseLoader from 'react-spinners/PulseLoader';

import AuthContext from '../../../context/Authcontext';

const MyTenders = () => {
  const [tendersData, setTendersData] = useState(null);
  const { authTokens } = useContext(AuthContext);
  const history = useHistory();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/get_host_tenders?status=open', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authTokens.access}`,
          },
        });

        const data = await response.json();
        console.log(data);
        setTendersData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [authTokens]);

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
    <>
      <div className="tenders-container">
        <div className="gradient__text mytender">
          <h1 className="first_title">المناقصات المنشورة</h1>
        </div>
        {tendersData && tendersData.length === 0 && (
          <div style={{ alignItems: 'center', textAlign: 'center', marginTop: '100px' }}>
            <p className="national" style={{ alignItems: 'center', textAlign: 'center' }}>لا توجد مناقصات منشورة حاليا</p>
            <button
              // style={{ padding: '12px', marginLeft: '150px', marginRight: '100px' }}
              type="submit"
              className="button_awating"
              onClick={() => {
                history.push('create_tender');
              }}
            >
              إنشاء مناقصة
            </button>
          </div>
        )}
        {tendersData
          && tendersData.map((tender, index) => (
            <Link style={{ 'text-decoration': 'none' }} key={index} to={`/tender/${tender.id}`}>
              <div className="tender-cards">
                <h1 className="tender-title gradient__text">
                  {tender.ad?.title}
                </h1>
                <p className="topic">{tender.ad.topic}</p>

                <h2> اخر موعد لتقديم العروض {tender.ad?.deadline_arabic} </h2>
              </div>
            </Link>
          ))}
      </div>
    </>
  );
};

export default MyTenders;
