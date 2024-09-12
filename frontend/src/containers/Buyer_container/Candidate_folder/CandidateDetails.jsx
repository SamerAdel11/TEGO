import React, { useState, useEffect, useContext } from 'react';
import './CandidateDetails.css';
import { useParams, useHistory } from 'react-router-dom';
import PulseLoader from 'react-spinners/PulseLoader';
import AuthContext from '../../../context/Authcontext';

function CandidateDetails() {
  const { id } = useParams();
  console.log('معرف العطاء:', id);
  const [responseDetails, setResponseDetails] = useState(null);
  const { authTokens } = useContext(AuthContext);
  const history = useHistory();
  useEffect(() => {
    // This effect will run every time the location changes
    const unlisten = history.listen(() => {
      window.scrollTo(0, 0);
    });
    return () => {
      unlisten();
    };
  }, [history]);
  const handleSendResponse = async (tender) => {
    try {
      const status = 'awarded';
      const response = await fetch(
        `http://localhost:8000/award_tender/${id}/${tender.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authTokens.access}`,
          },
          body: JSON.stringify({ status }), // Include national ID in the request body
        },
      );

      const data = await response.json();
      console.log('Response sent:', data);
      history.push(`/awating_responses/${id}`);
    } catch (error) {
      console.error('Error sending response:', error);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchTenderDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/list_responses/${id}?status=candidate_pool`,
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
  if (!responseDetails) {
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
    <div className="tender-details-container">
      <div className="center-content">
        <div className="gradient__text mytender">
          <h1 style={{ marginBottom: '20px' }}>التقييم المالي</h1>
        </div>
        {/* eslint-disable-next-line no-nested-ternary */}
        {responseDetails !== null ? (
          <div>
            {responseDetails.map((tender, index) => (
              <div key={tender.id}>
                <div className="gradient__text mytender">
                  <h1 style={{ fontSize: '40px' }}>العرض رقم {index + 1}</h1>
                </div>
                <div className="center-content">
                  <p className="national"> هذا العرض ملائم لهذه المناقصة بنسبه {tender.score} %</p>
                </div>
                { tender.previous_work.length > 0 && (
                  <div>
                    <div className="gradient__text">
                      <h4 className="response">الاعمال السابقة</h4>
                    </div>
                    <table>
                      <thead>
                        <tr>
                          <th>رقم المشروع</th>
                          <th>عنوان المشروع</th>
                          <th>وصف المشروع</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tender.previous_work.map((work, indexx) => (
                          <tr key={indexx}>
                            <td>{indexx + 1}</td>
                            <td>{work.title}</td>
                            <td>{work.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="gradient__text">
                  <h4 className="response">منتجات العرض</h4>
                </div>
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
                          {product.supplying_status !== 'متوفر' ? '-' : product.provided_quantity } {product.supplying_status !== 'متوفر' ? '' : product.quantity_unit }
                        </td>
                        <td>{product.supplying_status !== 'متوفر' ? '-' : product.price }</td>
                        <td>{product.supplying_status !== 'متوفر' ? '-' : product.price * product.provided_quantity }</td>
                        <td>{product.supplying_status !== 'متوفر' ? '-' : product.product_description } </td>
                        <td>{product.supplying_status }</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan="3">السعر الإجمالي</td>
                      <td colSpan="2">{tender.offered_price}</td>
                      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                      {/* <td colSpan="2" /> */}
                    </tr>
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
                {index < responseDetails.length - 1 && (
                  <hr style={{ marginLeft: '5%' }} />
                )}
              </div>
            ))}
          </div>
        ) : (
          responseDetails && responseDetails.length > 0 ? (
            <p>جاري تحميل تفاصيل العطاء...</p>
          ) : (
            <div>
              <h3>لا يوجد عروض</h3>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default CandidateDetails;
