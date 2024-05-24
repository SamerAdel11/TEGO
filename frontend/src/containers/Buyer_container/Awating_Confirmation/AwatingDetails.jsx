import React, { useState, useEffect, useContext } from 'react';
import './AwatingDetails.css';
import { useParams } from 'react-router-dom';
import AuthContext from '../../../context/Authcontext';

function AwatingDetails() {
  const { id } = useParams();
  console.log('معرف العطاء:', id);
  const [responseDetails, setResponseDetails] = useState(null);
  const [supplierDetails, setSupplierDetails] = useState(null);

  const { authTokens } = useContext(AuthContext);
  const [activeContent, setActiveContent] = useState('details');

  useEffect(() => {
    let isMounted = true;

    const fetchTenderDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/get_responses/?tender_id=${id}&status=awarded,winner`,
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

  useEffect(() => {
    if (!responseDetails || responseDetails.length === 0) return;

    const fetchSupplierInfo = async () => {
      try {
        const supplierInfo = await fetch(
          `http://localhost:8000/companies?response_id=${responseDetails[0].id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authTokens.access}`,
            },
          },
        );
        const data = await supplierInfo.json();
        setSupplierDetails(data);
        console.log('تفاصيل المورد:', data);
      } catch (error) {
        console.error('خطأ في جلب تفاصيل المورد:', error);
      }
    };

    fetchSupplierInfo();
  }, [responseDetails, authTokens.access]);

  const showContent = (contentId) => {
    setActiveContent(contentId);
  };

  return (
    <div className="tender-details-container">
      <div className="center-content">
        <div className="gradient__text mytender">
          {/* <h1 className="first_title">جميع الردود</h1> */}
        </div>
        {responseDetails !== null ? (
          <div>
            {responseDetails.map((tender) => (
              <div key={tender.id}>
                <div className="gradient__text">
                  {/* <h3>العرض رقم {index + 1}</h3> */}
                </div>
                {responseDetails.status === 'awarded' ? (
                  <div>
                    <div className="center-content">
                      <p className="national">في إنتظار التاكيد من المورد</p>
                    </div>
                  </div>
                ) : (
                  <div className="center-content">
                    <p className="national">المورد أكد التعاقد علي المناقصة</p>
                    <div className="buttons_awating">
                      <button
                        className="button_awating"
                        type="button"
                        onClick={() => showContent('details')}
                      >
                        تفاصيل العطاء
                      </button>
                      <button
                        className="button_awating"
                        type="button"
                        onClick={() => showContent('contanct_info')}
                      >
                        معلومات الاتصال
                      </button>
                    </div>
                  </div>
                )}
                {activeContent === 'details' ? (
                  <div>
                    <h3> السعر المعروض : {tender.offered_price}</h3>
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
                            <td>{product.supplying_status ? product.price : '-' }</td>
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
                  </div>
                ) : (supplierDetails && (
                  <div style={{ marginLeft: '20px' }}>
                    <div className="gradient__text">
                      <h1>بيانات الشركة</h1>
                    </div>
                    <div className="form-group">
                      <label htmlFor="companyName">اسم الشركة
                        <input type="text" name="companyName" id="companyName" value={supplierDetails.name} />
                      </label>
                    </div>
                    <div className="form-group">
                      <label htmlFor="address">العنوان على الخريطة (اللوكيشن)
                        <input type="text" name="address" id="address" value={supplierDetails.location} />
                      </label>
                    </div>
                    <div className="row">
                      <div className="form-group col-md-4">
                        <label htmlFor="commercialRegistrationNumber">رقم السجل التجاري
                          <input type="text" name="commercialRegistrationNumber" id="commercialRegistrationNumber" value={supplierDetails.supplier.commercial_registration_number} />
                        </label>
                      </div>
                      <div className="form-group col-md-4">
                        <label htmlFor="registrationAuthority">جهة استخراج السجل التجاري
                          <input type="text" name="registrationAuthority" id="registrationAuthority" value={supplierDetails.city} />
                        </label>
                      </div>
                      <div className="form-group col-md-4">
                        <label htmlFor="taxCardNumber">رقم البطاقة الضريبية
                          <input type="text" name="taxCardNumber" id="taxCardNumber" value={supplierDetails.supplier.tax_card_number} />
                        </label>
                      </div>
                    </div>
                    <div className="row">
                      <div className="form-group col-md-4">
                        <label htmlFor="mobile">موبايل
                          <input type="text" name="mobile" id="mobile" value={supplierDetails.mobile} />
                        </label>
                      </div>
                      <div className="form-group col-md-4">
                        <label htmlFor="landline">تليفون أرضي
                          <input type="text" name="landline" id="landline" value={supplierDetails.landline} />
                        </label>
                      </div>
                      <div className="form-group col-md-4">
                        <label htmlFor="fax">فاكس
                          <input type="text" name="fax" id="fax" value={supplierDetails.fax_number} />
                        </label>
                      </div>
                    </div>
                    <div className="row">
                      <div className="form-group col-md-6">
                        <label htmlFor="companyType">نوع الشركة
                          <input type="text" name="fax" id="fax" value={supplierDetails.supplier.company_type} />
                        </label>
                      </div>
                      <div className="form-group col-md-6">
                        <label htmlFor="capital">رأس مال الشركة من واقع السجل التجاري بالجنيه المصري
                          <input type="text" name="capital" id="capital" value={supplierDetails.supplier.company_capital} />
                        </label>
                      </div>
                    </div>
                    <hr data-v-7e013592 />
                    <div style={{ marginBottom: '50px' }}>
                      {supplierDetails.owners.map((admin, index) => (
                        <div>
                          <div className="gradient__text">
                            <div className="center-content">
                              <h3>العضو رقم {index + 1}</h3>
                            </div>
                          </div>
                          <div key={index} className="row">
                            <div className="form-group col-md-6">
                              <label htmlFor={`owner_name_${index}`}>الاسم
                                <input type="text" name={`owner_name_${index}`} id={`owner_name_${index}`} value={admin.name} />
                              </label>
                            </div>
                            <div className="form-group col-md-6">
                              <label htmlFor={`Position_of_owner_${index}`}>المنصب
                                <input type="text" name={`The_owner_id_${index}`} id={`The_owner_id_${index}`} value={admin.onwer_position} />
                              </label>
                            </div>
                            <div className="form-group col-md-12">
                              <label htmlFor={`The_owner_id_${index}`}>الرقم القومي
                                <input type="text" name={`The_owner_id_${index}`} id={`The_owner_id_${index}`} value={admin.owner_id} />
                              </label>
                            </div>
                            <div className="form-group col-md-12">
                              <label htmlFor={`Owner_address_${index}`}>العنوان
                                <input type="text" name={`Owner_address_${index}`} id={`Owner_address_${index}`} value={admin.address} />
                              </label>
                            </div>
                          </div>
                        </div>

                      ))}
                    </div>
                  </div>
                )
                )}
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
