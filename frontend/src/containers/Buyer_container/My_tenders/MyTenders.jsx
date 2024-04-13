import React, { useState, useEffect, useContext } from 'react';
import './my_tender.css';
import AuthContext from '../../../context/Authcontext';

const MyTenders = () => {
  const [tendersData, setTendersData] = useState(null);
  const { authTokens } = useContext(AuthContext);

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
        setTendersData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [authTokens]);

  const [expandedTender, setExpandedTender] = useState(null);

  const toggleExpand = (index) => {
    if (expandedTender === index) {
      setExpandedTender(null);
    } else {
      setExpandedTender(index);
    }
  };

  return (
    <>
      <div className="tenders-container">
        <div className="gradient__text mytender">
          <h1 className="first_title">المناقصات المنشورة</h1>
        </div>
        {tendersData
        && tendersData.map((tender, index) => (
          <div
            key={index}
            className={`tender-card ${
              expandedTender === index ? 'expanded' : 'shrunk'
            }`}
            onClick={() => toggleExpand(index)}
          >
            <h1 className="tender-title gradient__text">
              {tender.ad?.title}
            </h1>
            <div className="tender-details">
              <p className="tender-topic">موضوع المناقصة : {tender.ad?.topic}</p>
              <p className="tender-deadline">
                موعد التسليم :  {tender.ad?.deadline}
              </p>
              <p className="tender-field">المجال :  {tender.ad?.field}</p>
              <p className="tender-status">حالة المناقصة : {tender?.status}</p>
            </div>
            <div className="tender-admins">
              <div className="gradient__text mytender">
                <h3>الاعضاء</h3>
              </div>
              <ul>
                {tender.admins.map((admin, adminIndex) => (
                  <tr key={adminIndex}>
                    <td>{admin.name}</td>
                    <td>{admin.job_title}</td>
                  </tr>
                ))}
              </ul>
            </div>
            <div className="tender-admins">
              <div className="gradient__text mytender">
                <h3>المنتجات</h3>
              </div>
              <ul>
                {tender.products.map((product, productIndex) => (
                  <tr key={productIndex}>
                    <td>{product.title}</td>
                    <td>{product.quantity} {product.quantity_unit}</td>
                    <td>{product.description}</td>
                  </tr>
                ))}
              </ul>
            </div>
            {/* <p className="tender-initial-price">
            </p> */}
            <div className="gradient__text mytender">
              <h3> السعر المبدائي : {tender.initial_price}</h3>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default MyTenders;
