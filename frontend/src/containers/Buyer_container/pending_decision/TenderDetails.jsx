import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from '../../../context/Authcontext';

function TenderDetails() {
  const { id } = useParams(); // Get the tender ID from the route params
  console.log('Tender ID:', id); // Log the tender ID
  const [responseDetails, setResponseDetails] = useState(null);
  const { authTokens } = useContext(AuthContext);

  useEffect(() => {
    let isMounted = true; // Flag to track if the component is mounted

    const fetchTenderDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8000/get_responses/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authTokens.access}`,
          },
        });

        const data = await response.json();
        console.log('Tender Details:', data); // Log the response data

        if (isMounted) { // Check if the component is still mounted before updating state
          setResponseDetails(data);
        }
      } catch (error) {
        console.error('Error fetching tender details:', error);
      }
    };

    fetchTenderDetails();

    return () => {
      // Cleanup function to run when the component is unmounted
      isMounted = false; // Update the mounted flag to false when unmounting
    };
  }, [id, authTokens.access]);

  return (
    <div className="tender-details-container">
      <h1>Response Details</h1>
      {responseDetails ? (
        <div>
          {responseDetails.map((tender, outerIndex) => (
            <div key={outerIndex}>
              <p>Response ID: {tender.id}</p>
              <p>Status: {tender.status}</p>
              <p>Offered Price: {tender.offered_price}</p>
              <h3>Offer Products:</h3>
              {tender.offer_products.map((product, innerIndex) => (
                <div key={innerIndex}>
                  <p>Product ID: {product.id}</p>
                  {product.supplying_status ? (
                    <div>
                      <p>Product Name:{product.title}</p>
                      <p>Provided Quantity: {product.provided_quantity}</p>
                      <p>Product Price: {product.product_price}</p>
                      <p>Supplying Duration: {product.supplying_duration}</p>
                      <p>Product Description: {product.product_description}</p>
                    </div>
                  ) : (
                    <p>Supplying Status: False</p>
                  )}
                </div>
              ))}
              <h3>Offer Conditions:</h3>
              {tender.offer_conditions.map((condition, innerIndex) => (
                <p key={innerIndex}>Condition {innerIndex + 1}: {condition.condition}</p>
              ))}
              <h1>---------------------------------------------------------------------------------------------</h1>
            </div>
          ))}
        </div>
      ) : (
        <p>Loading tender details...</p>
      )}
    </div>
  );
}

export default TenderDetails;
