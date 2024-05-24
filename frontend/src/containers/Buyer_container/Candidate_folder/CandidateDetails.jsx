import React, { useState, useEffect, useContext } from 'react';
import './CandidateDetails.css';
import { useParams } from 'react-router-dom';
import AuthContext from '../../../context/Authcontext';

function CandidateDetails() {
  const { id } = useParams();
  console.log('معرف العطاء:', id);
  const [responseDetails, setResponseDetails] = useState(null);
  const { authTokens } = useContext(AuthContext);

  const handleSendResponse = async (tender) => {
    try {
      const status = 'awarded';
      const response = await fetch(
        `http://localhost:8000/award_tender?tender=${id}&response=${tender.id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authTokens.access}`,
          },
          body: JSON.stringify({ status }), // Include national ID in the request body
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

  // const [nationalID, setNationalID] = useState(''); // Moved nationalID declaration here

  // const handleNationalIDChange = (event) => { // Added function to handle changes in the national ID input field
  //   setNationalID(event.target.value);
  // };

  return (
    <div className="tender-details-container">
      <div className="center-content">
        {responseDetails !== null ? (
          <div>
            {responseDetails.map((tender, index) => (
              <div key={tender.id}>
                <div className="gradient__text mytender">
                  <h1>العرض رقم {index + 1}</h1>
                </div>
                <h3> السعر المعروض : {tender.offered_price}</h3>
                <h3> هذا العرض ملائم لهذه المناقصة بنسبه {tender.score}%</h3>
                { tender.previous_work.length > 0 && (
                <div>
                  <h4 className="response">الاعمال السابقة</h4>
                </div>
                )}
                {tender.previous_work.map((work, indexx) => (
                  <div key={indexx}>
                    <div className="center-content">
                      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                      <label>المشروع رقم {indexx + 1}</label>
                    </div>
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                    <label htmlFor="prevtenderTitle">عنوان المناقصة
                      <input type="text" id="prevtenderTitle" value={work.title} readOnly="readonly" />
                    </label>
                    <label htmlFor="prevtenderSubject">موضوع المشروع
                      <textarea
                        readOnly="readonly"
                        type="text"
                        id={`prevtenderSubject${index}`}
                        value={work.description}
                      />
                    </label>
                    <hr style={{ marginRight: '15%', marginLeft: '15%' }} />
                  </div>
                ))}
                <h4 className="response">منتجات العرض</h4>

                <table>
                  <thead>
                    <tr>
                      <th>معرف المنتج</th>
                      <th>اسم المنتج</th>
                      <th>الكمية المقدمة</th>
                      <th>سعر الوحدة</th>
                      <th>سعر الكمية</th>
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
                          {product.supplying_status !== 'متوفر' ? '' : product.quantity_unit } {product.supplying_status !== 'متوفر' ? '-' : product.provided_quantity }
                        </td>
                        <td>{product.supplying_status !== 'متوفر' ? '-' : product.price }</td>
                        <td>{product.supplying_status !== 'متوفر' ? '-' : product.price * product.provided_quantity }</td>
                        <td>{product.supplying_status !== 'متوفر' ? '-' : product.product_description } </td>
                        <td>{product.supplying_status }</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {tender.offer_conditions.length > 0 && (
                  <div>
                    <h4 className="response">شروط العرض</h4>
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
                {/* <p className="national">في حالة اختيار المرشح الرجاء ادخال الهوية الوطنية الخاصة بك</p>
                <div className="national-id-field">
                  <input
                    type="text"
                    placeholder="الرجاء إدخال الهوية الوطنية الخاصة بك"
                    className="national-id-input"
                    value={nationalID}
                    onChange={handleNationalIDChange} // Added onChange handler for the national ID input field
                  />
                </div> */}
                <button
                  className="buton_resonpose"
                  type="button"
                  onClick={() => handleSendResponse(tender)}
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

export default CandidateDetails;
