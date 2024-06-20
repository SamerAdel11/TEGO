/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useContext } from 'react';
import './TenderDetails.css';
import { useParams, useHistory } from 'react-router-dom';
import PulseLoader from 'react-spinners/PulseLoader';

import AuthContext from '../../../context/Authcontext';

function TenderDetails() {
  const { id } = useParams(); // الحصول على معرف العطاء من معلمات المسار
  console.log('معرف العطاء:', id); // تسجيل معرف العطاء
  const [responseDetails, setResponseDetails] = useState(null);
  const { authTokens } = useContext(AuthContext);
  const histoyty = useHistory();

  useEffect(() => {
    let isMounted = true; // علم لتتبع ما إذا كان المكون مركوبًا

    const fetchTenderDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/get_responses/?tender_id=${id}&status=offered`,
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
      // دالة تنظيف لتشغيلها عند فك تركيب المكون
      isMounted = false; // تحديث العلم المركوب إلى خطأ عند فك التركيب
    };
  }, [id, authTokens.access]);
  useEffect(() => {
    // This effect will run every time the location changes
    const unlisten = histoyty.listen(() => {
      window.scrollTo(0, 0);
    });
    return () => {
      unlisten();
    };
  }, [histoyty]);
  const closeCandidatePool = async () => {
    const response = await fetch(
      `http://localhost:8000/close_candidate_pool?tender_id=${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authTokens.access}`,
        },
      },
    );

    const data = await response.json();
    if (data.Message === 'candidate_pool') {
      histoyty.push(`/candidate_responses/${id}`);
    } else if (data.Message === 'cancelled') {
      histoyty.push('/mytender');
    }
    console.log(data);
    // histoyty.push(`/awating_responses/${id}`);
  };
  const CancelTender = async () => {
    const response = await fetch(
      `http://localhost:8000/cancel_tender?tender_id=${id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authTokens.access}`,
        },
      },
    );

    const data = await response.json();
    if (data.Message === 'candidate_pool') {
      histoyty.push(`/candidate_responses/${id}`);
    } else if (data.Message === 'cancelled') {
      histoyty.push('/mytender');
    }
    console.log(data);
    // histoyty.push(`/awating_responses/${id}`);
  };
  const handleSendResponse = async (tender) => {
    try {
      // Assign 'candidate_pool' to the status variable
      const status = 'candidate_pool';

      // Send only the status in the request body
      const response = await fetch(
        `http://localhost:8000/update_response/${tender.id}/`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authTokens.access}`,
          },
          body: JSON.stringify({ status }), // Send only the status
        },
      );

      const data = await response.json();
      console.log('Response sent:', data); // Log the response from the backend
      // Refresh the page after the response is successfully sent
      if (responseDetails.length === 1) {
        closeCandidatePool();
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error sending response:', error);
    }
  };
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
        <div style={{ marginBottom: '20px' }} className="gradient__text mytender">
          <h1>العروض المقدمة</h1>
        </div>
        {responseDetails !== null ? (
          <div>
            {responseDetails.filter((tender) => tender.status !== 'candidate_pool').map((tender, index) => (
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
                        <td>{product.supplying_status !== 'متوفر' ? '-' : product.product_description } </td>
                        <td>{product.supplying_status }</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {tender.offer_conditions.length > 0 && (
                  <div>
                    <div className="gradient__text">
                      <h4 className="response">الشروط الخاصة</h4>
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

                <button
                  className="buton_resonpose"
                  type="button"
                  onClick={() => handleSendResponse(tender)}
                >
                  إرسال الرد إلى قائمة المرشح
                </button>
                {index + 1 !== responseDetails.length && (
                  <hr style={{ marginRight: '150px', marginLeft: '150px' }} data-v-7e013592 />
                )}
              </div>
            ))}
            {
              responseDetails.length === 0 && (
                <div>
                  <h3>لا يوجد عروض</h3>
                </div>
              )
            }
            {responseDetails.length > 0 && (
              <div className="button-container">
                <button
                  style={{ marginRight: '150px', marginLeft: '150px' }}
                  className="buton_resonpose"
                  type="button"
                  onClick={closeCandidatePool}
                >
                  إغلاق قائمه المرشحين
                </button>
                <button
                  style={{ marginLeft: '150px' }}
                  className="button cancel"
                  type="button"
                  onClick={CancelTender}
                >
                  إلغاء المناقصة
                </button>
              </div>
            )}
          </div>
        ) : (
          <p>جاري تحميل تفاصيل العطاء...</p>
        )}
      </div>
    </div>
  );
}

export default TenderDetails;
