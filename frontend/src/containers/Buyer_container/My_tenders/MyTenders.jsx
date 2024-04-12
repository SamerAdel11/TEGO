import React, { useState, useEffect, useContext } from 'react';
import './my_tender.css';
import AuthContext from '../../../context/Authcontext';

const MyTenders = () => {
  const [tenderData, setTenderData] = useState(null);
  const { authTokens } = useContext(AuthContext);
  // console.log(authTokens.access + 'fady');
  console.log('fady');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/get_tenders', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authTokens.access}`,
          },
        }).then((data) => data.json())
          .then((d) => console.log(d));

        const data = await response.json();
        setTenderData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [authTokens]);

  return (
    <div className="my-tenders-container">
      {tenderData && (
        <>
          <h1 className="tender-title">{tenderData.ad?.title}</h1>
          <div className="tender-details">
            <p className="tender-topic">Topic: {tenderData.ad?.topic}</p>
            <p className="tender-deadline">Deadline: {tenderData.ad?.deadline}</p>
            <p className="tender-field">Field: {tenderData.ad?.field}</p>
            <p className="tender-status">Status: {tenderData?.status}</p>
          </div>
          <div className="tender-admins">
            <h2>Admins:</h2>
            <ul>
              {tenderData.admins.map((admin, index) => (
                <li key={index}>
                  <p>{admin.name}</p>
                  <p>{admin.job_title}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="tender-conditions">
            <h2>Conditions:</h2>
            <div className="public-conditions">
              <h3>Public Conditions:</h3>
              <ul>
                {tenderData.public_conditions.map((condition, index) => (
                  <li key={index}>{condition.condition}</li>
                ))}
              </ul>
            </div>
            <div className="private-conditions">
              <h3>Private Conditions:</h3>
              <ul>
                {tenderData.private_conditions.map((condition, index) => (
                  <li key={index}>{condition.condition}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="tender-products">
            <h2>Products:</h2>
            <ul>
              {tenderData.products.map((product, index) => (
                <li key={index}>
                  <p>{product.title}</p>
                  <p>{product.quantity} {product.quantity_unit}</p>
                  <p>{product.description}</p>
                </li>
              ))}
            </ul>
          </div>
          <p className="tender-initial-price">Initial Price: {tenderData.initial_price}</p>
        </>
      )}
    </div>
  );
};

export default MyTenders;
