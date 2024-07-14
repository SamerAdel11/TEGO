import React, { useState, useEffect, useContext } from 'react';
// import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import './AwatingDetails.css';
import { useParams, useHistory } from 'react-router-dom';
import PulseLoader from 'react-spinners/PulseLoader';
import AuthContext from '../../../context/Authcontext';

function AwatingDetails() {
  const { id } = useParams();
  const history = useHistory();
  const [responseDetails, setResponseDetails] = useState(null);
  const [supplierDetails, setSupplierDetails] = useState(null);
  const [activeButton, setActiveButton] = useState('details');
  const { authTokens } = useContext(AuthContext);
  const [activeContent, setActiveContent] = useState('details');
  const [transaction, setTransaction] = useState('');
  const [open, setOpen] = useState(false);
  // const [reviewDateOpen, setreviewDateOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');
  const [dateerror, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get the current date
    const today = new Date();
    // Format the date as yyyy-mm-dd
    const formattedMinDate = today.toISOString().split('T')[0];
    const nextYear = new Date(today);
    nextYear.setFullYear(today.getFullYear() + 1);
    const formattedMaxDate = nextYear.toISOString().split('T')[0];

    setMinDate(formattedMinDate);
    setMaxDate(formattedMaxDate);
    // Set the minDate state
  }, []);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
  const handleDateChange = (event) => {
    const date = event.target.value;
    setSelectedDate(date);
    if (date < minDate) {
      setError('يرجي اختيار موعد قادم صحيح');
    } else if (date > maxDate) {
      setError(`يرجي اختيار موعد قبل ${formatDate(maxDate)}`);
    } else {
      setError('');
    }
    // console.log('Tender opening date selected:', date);
    // Additional actions can be added here
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleAccepte = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/transactions/${transaction.response}/${id}/`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authTokens.access}`,
          },
          body: JSON.stringify({
            response: transaction.response,
            tender: id,
            product_review_status: 'accepted',
          }),
        },
      );

      // const data = await response.json();
      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      alert(error);
      console.error('خطأ في جلب تفاصيل العطاء:', error);
    }
    setOpen(false);
  };

  const handleReject = async () => {
    setOpen(false);
    try {
      const response = await fetch(
        `http://localhost:8000/transactions/${transaction.response}/${id}/`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authTokens.access}`,
          },
          body: JSON.stringify({
            response: transaction.response,
            tender: id,
            product_review_status: 'rejected',
          }),
        },
      );

      // const data = await response.json();
      if (response.ok) {
        history.push(`/candidate_responses/${id}`);
      }
    } catch (error) {
      alert(error);
      console.error('خطأ في جلب تفاصيل العطاء:', error);
    }
  };

  const ReviewDateSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/transactions/${transaction.response}/${id}/`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authTokens.access}`,
          },
          body: JSON.stringify({
            response: transaction.response,
            tender: id,
            product_review_date: selectedDate,
            product_review_date_status: 'waiting_for_supplier',
          }),
        },
      );

      // const data = await response.json();
      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      alert(error);
      console.error('خطأ في جلب تفاصيل العطاء:', error);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchResponseDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/list_responses/${id}?status=awarded,winner`,
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
        if (Array.isArray(data) && data.length > 0) {
          const responseId = data[0].id;
          if (data[0].status === 'winner') {
            try {
              const response2 = await fetch(
                `http://localhost:8000/transactions/${responseId}/${id}/`,
                {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authTokens.access}`,
                  },
                },
              );
              const transactionData = await response2.json();
              console.log('transaction:', data);
              setTransaction(transactionData);
            } catch (error) {
              console.error('خطأ في جلب تفاصيل العطاء:', error);
            }
          }
        } else {
          console.error('Unexpected response format:', data);
        }
        if (isMounted) {
          setResponseDetails(data);
        }
      } catch (error) {
        console.error('خطأ في جلب تفاصيل العطاء:', error);
      }
    };
    fetchResponseDetails();

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
    setActiveButton(contentId);
  };
  const ConfirmDate = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/transactions/${transaction.response}/${id}/`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authTokens.access}`,
          },
          body: JSON.stringify({
            response: transaction.response,
            product_review_date_status: 'accepted',
            tender: id,
          }),
        },
      );

      // const data = await response.json();
      if (response.ok) {
        // window.location.reload();
      }
    } catch (error) {
      // alert(error);
      console.error('خطأ في جلب تفاصيل العطاء:', error);
    }
  };
  const downloadPDF = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/contract/${id}/${responseDetails[0].id}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authTokens.access}`,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'contract.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      setLoading(false);
    } catch (error) {
      console.error('Error downloading the PDF:', error);
      setLoading(false);
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
    <div className="tender-details-container" style={{ marginBottom: '50px' }}>
      <div className="center-content">
        <div className="gradient__text mytender">
          {/* <h1 className="first_title">جميع الردود</h1> */}
        </div>
        {responseDetails !== null ? (
          <div>
            {/* tender below means the response not tender */}
            {responseDetails.map((response) => (
              <div key={response.id}>
                <div className="gradient__text">
                  {/* <h3>العرض رقم {index + 1}</h3> */}
                </div>
                {
                  response.status === 'winner' && !transaction.product_review_date_status !== 'waiting_for_host' && (
                    <div className="center-content">
                      {!transaction.product_review_date_status && (
                        <p className="national">المورد أكد التعاقد علي المناقصة</p>
                      )}
                      <div className="buttons_awating">
                        <button
                          style={{ border: 'none', outline: 'none', backgroundColor: activeButton === 'details' && '#AA1910' }}
                          className="button_awating"
                          type="button"
                          onClick={() => showContent('details')}
                        >
                          تفاصيل العطاء
                        </button>
                        <button
                          style={{ border: 'none', outline: 'none', backgroundColor: activeButton === 'contanct_info' && '#AA1910' }}
                          className="button_awating"
                          type="button"
                          onClick={() => showContent('contanct_info')}
                        >
                          بيانات الشركة
                        </button>
                      </div>
                    </div>
                  )
                  }
                {transaction.product_review_status === 'accepted' && (
                  <div className="center-content">
                    <p className="national">لقد وافقت علي منتجات المورد</p>
                  </div>
                )}
                {transaction.product_review_status === 'host_decision' && (
                  <div className="center-content">
                    <p className="national">يرجي الموافقة او الرفض علي منتجات المورد</p>
                  </div>
                )}
                {transaction.product_review_date_status === 'accepted' && !transaction.product_review_status && (
                  <div className="center-content">
                    <p className="national"> تم تحديد يوم {transaction.review_date_arabic} لمراجعة المنتجات</p>
                  </div>
                )}
                {transaction && transaction.product_review_date_status === 'waiting_for_supplier' && (
                  <div className="center-content">
                    <p className="national"> في انتظار التأكيد علي الموعد من المورد</p>
                  </div>
                )}
                {response.status === 'awarded' && !transaction.product_review_date_status && (
                  <div>
                    <div className="center-content">
                      <p className="national">في إنتظار التاكيد من المورد</p>
                    </div>
                  </div>
                )}
                {transaction && transaction.product_review_date_status === 'waiting_for_host' && (
                  <div>
                    <div className="center-content">
                      <p style={{ fontSize: '20px' }} className="national">المورد لم يناسبه الموعد المقدم منك ؛ لذلك اقترح موعد {transaction.review_date_arabic} اذا لم يناسبك يمكنك اختيار موعد اخر</p>
                    </div>
                    <div className="buttons_awating">
                      <button
                        style={{ padding: '12px', marginLeft: '150px', marginRight: '100px' }}
                        type="submit"
                        className="button_awating"
                        onClick={(e) => {
                          e.preventDefault();
                          ConfirmDate();
                          window.location.reload();
                        }}
                      >
                        موافق
                      </button>
                      <button
                        type="button"
                        style={{ background: 'red', padding: '0px', marginLeft: '90px' }}
                        className="button_awating"
                        onClick={(e) => {
                          e.preventDefault();
                          handleClickOpen();
                        }}
                      >
                        اختيار موعد اخر
                      </button>
                      <Dialog
                        style={{ backgroundColor: '#073057' }}
                        open={open}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                      >
                        <DialogTitle style={{ color: 'white', backgroundColor: '#073057', fontFamily: 'Alexandria', fontSize: 'x-large', marginBottom: '1px', padding: '15px' }} id="alert-dialog-title">
                          موعد مراجعة المنتجات
                        </DialogTitle>
                        <DialogContent style={{ backgroundColor: '#073057', color: 'white' }}>
                          {/* <DialogContentText style={{ backgroundColor: '#073057', color: 'white', fontSize: 'x-large', textAlign: 'center', paddingLeft: '50px', paddingRight: '50px' }} id="alert-dialog-description">
                            يرجي اختيار موعد لتحديد مراجعة المنتجات
                          </DialogContentText> */}
                          <div className="form-fields">
                            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                            <label style={{ paddingBottom: '10px', marginTop: '20px' }} htmlFor="tenderOpeningDate">يرجي اختيار الموعد المناسب لك لمراجعة المنتجات </label>
                            <input
                              type="date"
                              id="tenderOpeningDate"
                              value={selectedDate}
                              onChange={handleDateChange}
                              max={maxDate}
                            />
                            {dateerror && <p style={{ color: 'red' }}>{dateerror}</p>}
                          </div>
                        </DialogContent>
                        <DialogActions style={{ backgroundColor: '#073057' }}>
                          <button type="button" style={{ backgroundColor: '#FC432E', color: 'white', fontFamily: 'Alexandria' }} onClick={ReviewDateSubmit}>اختيار</button>
                        </DialogActions>
                      </Dialog>
                    </div>
                  </div>
                )}
                {transaction.product_review_status === 'host_decision' && (
                  <div>
                    {/* eslint-disable-next-line react/jsx-fragments */}
                    <button
                      style={{ border: 'none', outline: 'none' }}
                      className="button_awating"
                      type="button"
                      onClick={handleClickOpen}
                    >
                      تأكيد / رفض المنتجات
                    </button>
                    <Dialog
                      style={{ backgroundColor: '#073057' }}
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle style={{ color: 'white', backgroundColor: '#073057', fontFamily: 'Alexandria', fontSize: 'x-large', marginBottom: '1px', padding: '15px' }} id="alert-dialog-title">
                        تأكيد المنتج
                      </DialogTitle>
                      <DialogContent style={{ backgroundColor: '#073057', color: 'white' }}>
                        <DialogContentText style={{ backgroundColor: '#073057', color: 'white', fontSize: 'x-large', textAlign: 'center', paddingLeft: '50px', paddingRight: '50px' }} id="alert-dialog-description">
                          هل توافق علي المنتجات اللتي تمت مراجعتها
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions style={{ backgroundColor: '#073057' }}>
                        <button type="button" style={{ backgroundColor: '#FC432E', color: 'white', margin: '20px', fontFamily: 'Alexandria' }} onClick={handleAccepte}>موافق</button>
                        <button type="button" style={{ backgroundColor: '#F60034', color: 'white', margin: '20px', fontFamily: 'Alexandria' }} onClick={handleReject}>
                          رفض
                        </button>
                      </DialogActions>
                    </Dialog>
                  </div>
                )}
                { response.status === 'winner' && transaction.product_review_status === 'accepted' && (
                  <button
                    type="submit"
                    className="button_awating"
                    onClick={downloadPDF}
                  >
                    {loading ? 'جاري التحميل....' : 'حمل العقد'}
                  </button>
                )}
                {activeContent === 'details' ? (
                  <div style={{ marginLeft: '80px', width: '100%' }}>

                    { response.previous_work.length > 0 && (
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
                            {response.previous_work.map((work, indexx) => (
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
                        {response.offer_products.map((product, innerIndex) => (
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
                        <tr>
                          <td colSpan="3">السعر الإجمالي</td>
                          <td colSpan="2">{response.offered_price}</td>
                          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                          {/* <td colSpan="2" /> */}
                        </tr>
                      </tbody>
                    </table>
                    {response.offer_conditions.length > 0 && (
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
                            {response.offer_conditions.map(
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
                    {/* {transaction.product_review_date_status === 'waiting_for_supplier' && (
                    <div className="center-content">
                      <p className="national">في انتظار التأكيد علي الموعد من المورد</p>
                    </div>
                    )} */}
                    {!transaction.product_review_date_status && response.status === 'winner' && (
                      <div className="form-fields">
                        <button
                          style={{ border: 'none', outline: 'none' }}
                          className="button_awating"
                          type="button"
                          onClick={handleClickOpen}
                        >
                          تحديد موعد لمراجعةالمنتجات
                        </button>
                        <Dialog
                          style={{ backgroundColor: '#073057' }}
                          open={open}
                          onClose={handleClose}
                          aria-labelledby="alert-dialog-title"
                          aria-describedby="alert-dialog-description"
                        >
                          <DialogTitle style={{ color: 'white', backgroundColor: '#073057', fontFamily: 'Alexandria', fontSize: 'x-large', marginBottom: '1px', padding: '15px' }} id="alert-dialog-title">
                            موعد مراجعة المنتجات
                          </DialogTitle>
                          <DialogContent style={{ backgroundColor: '#073057', color: 'white' }}>
                            {/* <DialogContentText style={{ backgroundColor: '#073057', color: 'white', fontSize: 'x-large', textAlign: 'center', paddingLeft: '50px', paddingRight: '50px' }} id="alert-dialog-description">
                              يرجي اختيار موعد لتحديد مراجعة المنتجات
                            </DialogContentText> */}
                            <div className="form-fields">
                              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                              <label style={{ paddingBottom: '10px', marginTop: '20px' }} htmlFor="tenderOpeningDate">يرجي اختيار الموعد المناسب لك لمراجعة المنتجات </label>
                              <input
                                type="date"
                                id="tenderOpeningDate"
                                value={selectedDate}
                                onChange={handleDateChange}
                                max={maxDate}
                              />
                              {dateerror && <p style={{ color: 'red' }}>{dateerror}</p>}
                            </div>
                          </DialogContent>
                          <DialogActions style={{ backgroundColor: '#073057' }}>
                            <button type="button" style={{ backgroundColor: '#FC432E', color: 'white', fontFamily: 'Alexandria' }} onClick={ReviewDateSubmit}>اختيار</button>
                          </DialogActions>
                        </Dialog>
                        {/* eslint-disable-next-line comma-dangle */}
                      </div>
                    )}
                  </div>
                ) : (supplierDetails && (
                  <div style={{ marginLeft: '80px' }}>
                    <div className="gradient__text">
                      <h1>بيانات الشركة</h1>
                    </div>
                    <div className="form-group">
                      <label htmlFor="companyName">اسم الشركة
                        <input className="input-margin" type="text" name="companyName" id="companyName" value={supplierDetails.name} />
                      </label>
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">البريد الالكتروني
                        <input type="text" name="email" id="email" value={supplierDetails.user.email} />
                      </label>
                    </div>
                    <div className="form-group">
                      <label htmlFor="address">العنوان على الخريطة (اللوكيشن)
                        <input className="input-margin" type="text" name="address" id="address" value={supplierDetails.location} />
                      </label>
                    </div>
                    <div className="row">
                      <div className="form-group col-md-4">
                        <label htmlFor="commercialRegistrationNumber">رقم السجل التجاري
                          <input className="input-margin" type="text" name="commercialRegistrationNumber" id="commercialRegistrationNumber" value={supplierDetails.supplier.commercial_registration_number} />
                        </label>
                      </div>
                      <div className="form-group col-md-4">
                        <label htmlFor="registrationAuthority">جهة استخراج السجل التجاري
                          <input className="input-margin" type="text" name="registrationAuthority" id="registrationAuthority" value={supplierDetails.city} />
                        </label>
                      </div>
                      <div className="form-group col-md-4">
                        <label htmlFor="taxCardNumber">رقم البطاقة الضريبية
                          <input className="input-margin" type="text" name="taxCardNumber" id="taxCardNumber" value={supplierDetails.supplier.tax_card_number} />
                        </label>
                      </div>
                    </div>
                    <div className="row">
                      <div className="form-group col-md-4">
                        <label htmlFor="mobile">موبايل
                          <input className="input-margin" type="text" name="mobile" id="mobile" value={supplierDetails.mobile} />
                        </label>
                      </div>
                      <div className="form-group col-md-4">
                        <label htmlFor="landline">تليفون أرضي
                          <input className="input-margin" type="text" name="landline" id="landline" value={supplierDetails.landline} />
                        </label>
                      </div>
                      <div className="form-group col-md-4">
                        <label htmlFor="fax">فاكس
                          <input className="input-margin" type="text" name="fax" id="fax" value={supplierDetails.fax_number} />
                        </label>
                      </div>
                    </div>
                    <div className="row">
                      <div className="form-group col-md-6">
                        <label htmlFor="companyType">نوع الشركة
                          <input className="input-margin" type="text" name="fax" id="fax" value={supplierDetails.supplier.company_type} />
                        </label>
                      </div>
                      <div className="form-group col-md-6">
                        <label htmlFor="capital">رأس مال الشركة من واقع السجل التجاري بالجنيه المصري
                          <input className="input-margin" type="text" name="capital" id="capital" value={supplierDetails.supplier.company_capital} />
                        </label>
                      </div>
                    </div>
                    <hr data-v-7e013592 />
                    <div style={{ marginBottom: '50px' }}>
                      {supplierDetails.owners.length > 0 && (
                        <div className="gradient__text">
                          <h1>ملاك / اعضاء الشركة</h1>
                        </div>
                      )}
                      {supplierDetails.owners.map((admin, index) => (
                        <div>
                          {/* <div className="gradient__text"> */}
                          <div className="center-content">
                            <p className="national">العضو رقم {index + 1}</p>
                          </div>
                          {/* </div> */}
                          <div key={index} className="row">
                            <div className="form-group col-md-6">
                              <label htmlFor={`owner_name_${index}`}>الاسم
                                <input className="input-margin" type="text" name={`owner_name_${index}`} id={`owner_name_${index}`} value={admin.name} />
                              </label>
                            </div>
                            <div className="form-group col-md-6">
                              <label htmlFor={`Position_of_owner_${index}`}>المنصب
                                <input className="input-margin" type="text" name={`The_owner_id_${index}`} id={`The_owner_id_${index}`} value={admin.onwer_position} />
                              </label>
                            </div>
                            <div className="form-group col-md-12">
                              <label htmlFor={`The_owner_id_${index}`}>الرقم القومي
                                <input className="input-margin" type="text" name={`The_owner_id_${index}`} id={`The_owner_id_${index}`} value={admin.owner_id} />
                              </label>
                            </div>
                            <div className="form-group col-md-12">
                              <label htmlFor={`Owner_address_${index}`}>العنوان
                                <input className="input-margin" type="text" name={`Owner_address_${index}`} id={`Owner_address_${index}`} value={admin.address} />
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
