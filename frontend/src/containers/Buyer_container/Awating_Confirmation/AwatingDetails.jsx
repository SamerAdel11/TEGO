import React, { useState, useEffect, useContext } from 'react';
import './AwatingDetails.css';
import { useParams, Link } from 'react-router-dom';
import AuthContext from '../../../context/Authcontext';

function AwatingDetails() {
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
        {responseDetails !== null ? (
          <div>
            {responseDetails.map((tender, index) => (
              <div key={tender.id}>
                <div className="gradient__text">
                  <h3>العرض رقم {index + 1}</h3>
                  <h3> السعر المعروض : {tender.offered_price}</h3>

                </div>
                <div className="buttons_awating">
                  <Link style={{ 'text-decoration': 'none' }} key={index} to={`/awating_responses/${tender.id}`}>
                    <button
                      className="button_awating"
                      type="button"
                    >
                      تفاصيل العطاء
                    </button>
                  </Link>
                  <Link style={{ 'text-decoration': 'none' }} key={index} to={`/awating_contact/${tender.id}`}>
                    <button
                      className="button_awating"
                      type="button"
                    >
                      معلومات الاتصال
                    </button>
                  </Link>

                </div>
                <div className="gradient__text">
                  <h4 className="response">منتجات العرض</h4>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>معرف المنتج</th>
                      <th>اسم المنتج</th>
                      <th>الكمية المقدمة</th>
                      {/* <th>سعر المنتج</th> */}
                      <th>مدة التوريد</th>
                      <th style={{ maxWidth: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', wordWrap: 'break-word' }}>وصف المنتج</th>
                      <th>حالة التوريد</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tender.offer_products.map((product, innerIndex) => (
                      <tr key={innerIndex}>
                        <td>{innerIndex + 1}</td>
                        <td>{product.title}</td>
                        <td>
                          {product.supplying_status !== 'متوفر' ? '-' : product.provided_quantity } {product.supplying_status !== 'متوفر' ? '' : product.quantity_unit }
                        </td>
                        <td>{product.supplying_status ? product.supplying_duration : '-' }</td>
                        <td>{product.supplying_status !== 'متوفر' ? '-' : product.product_description } </td>
                        <td>{product.supplying_status }</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {tender.offer_conditions.length > 0 && (
                  <div>
                    <div className="gradient__text">
                      <h4 className="response">شروط العرض</h4>
                    </div>
                    <table>
                      <thead>
                        <tr>
                          <th>رقم الشرط</th>
                          <th>الشرط</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tender.offer_conditions.map(
                          (condition, innerIndex) => (
                            <tr key={innerIndex}>
                              <td>{innerIndex + 1}</td>
                              <td>{condition.offered_condition}</td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
                <p className="national">في حالة اختيار المرشح الرجاء ادخال الهوية الوطنية الخاصة بك</p>
                <div className="national-id-field">
                  <input
                    type="text"
                    placeholder="الرجاء إدخال الهوية الوطنية الخاصة بك"
                    className="national-id-input"
                    value={nationalID}
                    onChange={handleNationalIDChange} // Added onChange handler for the national ID input field
                  />
                </div>
                <button
                  className="buton_resonpose"
                  type="button"
                  onClick={() => handleSendResponse(tender, nationalID)}
                >
                  اختيار المرشح
                </button>
                <hr data-v-7e013592 />
              </div>
            ))}
          </div>
        ) : (
          <p>جاري تحميل تفاصيل العطاء...</p>
        )}
      </div>
    </div>
  );
}

export default AwatingDetails;
