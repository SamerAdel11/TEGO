import React, { useState, useEffect, useContext } from 'react';
import './TenderDetails.css';
import { useParams } from 'react-router-dom';
import AuthContext from '../../../context/Authcontext';

function TenderDetails() {
  const { id } = useParams(); // الحصول على معرف العطاء من معلمات المسار
  console.log('معرف العطاء:', id); // تسجيل معرف العطاء
  const [responseDetails, setResponseDetails] = useState(null);
  const { authTokens } = useContext(AuthContext);

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
      window.location.reload();
    } catch (error) {
      console.error('Error sending response:', error);
    }
  };

  useEffect(() => {
    let isMounted = true; // علم لتتبع ما إذا كان المكون مركوبًا

    const fetchTenderDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/get_responses/${id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authTokens.access}`,
            },
          },
        );

        const data = await response.json();
        console.log('تفاصيل العطاء:', data); // تسجيل بيانات الاستجابة

        if (isMounted) {
          // التحقق مما إذا كان المكون مركوبًا قبل تحديث الحالة
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

  return (
    <div className="tender-details-container">
      <div className="center-content">
        <div className="gradient__text mytender">
          <h1 className="first_title">جميع الردود</h1>
        </div>
        {responseDetails !== null ? (
          <div>
            {responseDetails.filter((tender) => tender.status !== 'candidate_pool').map((tender) => (
              <div key={tender.id}>
                <p className="response_p">الرد رقم : {tender.id}</p>
                <p className="response_p">الحالة : <span className="response_red">{tender.status}</span></p>
                <p className="response_p">
                  السعر المعروض : {tender.offered_price}
                </p>
                <div className="gradient__text">
                  <h4 className="response">منتجات العروض</h4>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>معرف المنتج</th>
                      <th>اسم المنتج</th>
                      <th>الكمية المقدمة</th>
                      <th>سعر المنتج</th>
                      <th>مدة التوريد</th>
                      <th>وصف المنتج</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tender.offer_products.map((product, innerIndex) => (
                      <tr key={innerIndex}>
                        <td>{product.id}</td>
                        <td>{product.title}</td>
                        <td>{product.provided_quantity}</td>
                        <td>{product.product_price}</td>
                        <td>{product.supplying_duration}</td>
                        <td>{product.product_description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {tender.offer_conditions.length > 0 && (
                  <div>
                    <div className="gradient__text">
                      <h4 className="response">شروط العروض</h4>
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
                              <td>{condition.condition}</td>
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
                  إرسال الرد إلى المرشحين
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

export default TenderDetails;
