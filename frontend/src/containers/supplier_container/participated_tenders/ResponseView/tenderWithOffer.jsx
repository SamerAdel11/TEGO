import React, { useState, useContext, useRef, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import PulseLoader from 'react-spinners/PulseLoader';

import AuthContext from '../../../../context/Authcontext';

// import './AddResponse.css';

function Response() {
  const history = useHistory();
  const { authTokens } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [products, setProducts] = useState(data && data.products);
  const [offer, setOffer] = useState(null);
  const textareaRefs = useRef([]);
  const [conditions, setConditions] = useState(data && data.public_conditions);
  const [privateconditions, setPrivateConditions] = useState(data && data.private_conditions);
  const [previousWork, setPreviousWork] = useState([]);
  const [previousWorkIndex, setPreviousWorkIndedx] = useState(0);
  const [showAddProjectButton, setShowAddProjectButton] = useState(true);
  const [transaction, setTransaction] = useState(null);
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const searchParams = new URLSearchParams(location.search);
  // const [totalPrice, setTotalPrice] = useState(0);
  const tenderId = searchParams.get('tender_id');
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');
  const [dateerror, setError] = useState('');
  const [HostDetails, setHostDetails] = useState(null);
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
  useEffect(() => {
    if (!offer || offer.length === 0) return;

    const fetchHostInfo = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/companies?tender_id=${tenderId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authTokens.access}`,
            },
          },
        );
        const hostinfo = await response.json();
        setHostDetails(hostinfo);
        console.log('تفاصيل الهوست:', hostinfo);
      } catch (error) {
        console.error('خطأ في جلب تفاصيل المورد:', error);
      }
    };

    fetchHostInfo();
  }, [offer, authTokens.access]);

  const handleClickOpen = () => {
    setOpen(true);
  };
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
  const handleAddProject = () => {
    const newPreviousWork = { id: previousWorkIndex + 1, title: '', description: '' };
    setPreviousWork([...previousWork, newPreviousWork]);
    setPreviousWorkIndedx(previousWorkIndex + 1);
    setShowAddProjectButton(false); // Hide the initial button after clicking
  };
  const handlePreviousWorkChange = (idx, field, value) => {
    const updatedWork = [...previousWork];
    updatedWork[idx][field] = value;
    setPreviousWork(updatedWork);
    console.log(previousWork);
  };
  // const textareaRef = useRef(Array.from({ length: 1 }, () => React.createRef()));
  const handleWorkTextArea = (event) => {
    const textarea = event.target;
    textarea.style.height = 'auto'; // Reset height to auto to measure content
    textarea.style.height = `${textarea.scrollHeight}px`; // Set height to fit content
  };
  const handleTextareaInput = (event, idx) => {
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;

    const updatedProducts = [...products];
    updatedProducts[idx] = {
      ...updatedProducts[idx],
      [textarea.name]: textarea.value,
    };
    setProducts(updatedProducts);
  };
  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const response = await fetch(`http://localhost:8000/get_tender/${tenderId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authTokens.access}`,
          },
        });

        const tender = await response.json();
        setData(tender);
        const productswithsupplystatus = tender.products.map((product) => ({
          ...product,
          supplying_status: '',
          price: '',
        }));
        setProducts(productswithsupplystatus);
        setConditions(tender.public_conditions);
        setPrivateConditions(tender.private_conditions);
        const adjustTextareaHeight = () => {
          const textarea = document.getElementById('tenderSubject');
          if (textarea) {
            textarea.style.height = 'auto'; // Reset height to auto to measure content
            textarea.style.height = `${textarea.scrollHeight}px`; // Set height to fit content
          }
          // eslint-disable-next-line no-plusplus
          for (let i = 0; i < tender.products.length; i += 1) {
            const textareatitle = document.getElementById(`title${i}`);
            const textareadescription = document.getElementById(`description${i}`);
            if (textareatitle) {
              textareatitle.style.height = 'auto'; // Reset height to auto to measure content
              textareatitle.style.height = `${textareatitle.scrollHeight}px`;
            }
            if (textareadescription) {
              textareadescription.style.height = 'auto'; // Reset height to auto to measure content
              textareadescription.style.height = `${textareadescription.scrollHeight}px`;
            }
          }
        };

        // Call the function to adjust textarea height on component mount
        adjustTextareaHeight();
      } catch (error) {
        console.error('Error fetching tenders:', error);
      }
    };
    const getResponse = async () => {
      try {
        const myresponse = await fetch(`http://localhost:8000/get_my_response?tender_id=${tenderId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authTokens.access}`,
          },
        });
        const myresponseData = await myresponse.json();
        setOffer(myresponseData);
        if (myresponseData.status === 'winner') {
          try {
            const response2 = await fetch(
              `http://localhost:8000/transactions/${myresponseData.id}/${tenderId}/`,
              {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${authTokens.access}`,
                },
              },
            );
            const transactionData = await response2.json();
            console.log('Transaction:', transactionData);
            setTransaction(transactionData);
          } catch (error) {
            console.error('خطأ في جلب تفاصيل العطاء:', error);
          }
        }
        const adjustTextareaHeight = () => {
          const textarea = document.getElementById('tenderSubject');
          if (textarea) {
            textarea.style.height = 'auto'; // Reset height to auto to measure content
            textarea.style.height = `${textarea.scrollHeight}px`; // Set height to fit content
          }
          // eslint-disable-next-line no-plusplus
          for (let i = 0; i < myresponseData.offer_products.length; i += 1) {
            const textareatitle = document.getElementById(`title${i}`);
            const textareadescription = document.getElementById(`description${i}`);
            if (textareatitle) {
              textareatitle.style.height = 'auto'; // Reset height to auto to measure content
              textareatitle.style.height = `${textareatitle.scrollHeight}px`;
            }
            if (textareadescription) {
              textareadescription.style.height = 'auto'; // Reset height to auto to measure content
              textareadescription.style.height = `${textareadescription.scrollHeight}px`;
            }
          }
        };
        console.log(myresponseData);
        adjustTextareaHeight();
      } catch (err) {
        console.log('Error in fetching response');
      }
    };
    fetchTenders();
    getResponse();
  }, [authTokens]);
  useEffect(() => {
    console.log('Transaction is here', transaction);
  });
  const handleProductChange = (idx, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[idx][field] = value;
    setProducts(updatedProducts);
  };
  const handleConditionChange = (idx, value) => {
    const updatedConditions = [...conditions];
    updatedConditions[idx].value = value;
    setConditions(updatedConditions);
  };
  const handlePrivateConditionChange = (idx, value) => {
    const updatedPrivateConditions = [...privateconditions];
    updatedPrivateConditions[idx].condition = value;
    setPrivateConditions(updatedPrivateConditions);
    console.log(updatedPrivateConditions);
  };
  const confirmNotification = async (decision) => {
    // e.preventDefault();
    const confirmationApi = await fetch(`http://localhost:8000/supplier_confirmation?tender_id=${tenderId}&response_id=${offer.id}&confirm_status=${decision}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authTokens.access}`,
      },
    });
    if (confirmationApi.ok) {
      console.log('Done');
      if (decision === 'rejected') {
        history.push('/rejected_offers');
      }
    } else {
      console.error('Error in submitting the data');
    }
  };
  const downloadPDF = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/contract/${tenderId}/${offer.id}/`, {
        method: 'POST',
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
  const ConfirmDate = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/transactions/${transaction.response}/${tenderId}/`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authTokens.access}`,
          },
          body: JSON.stringify({
            response: transaction.response,
            product_review_date_status: 'accepted',
            tender: tenderId,
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
  const ReviewDateSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/transactions/${transaction.response}/${tenderId}/`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authTokens.access}`,
          },
          body: JSON.stringify({
            response: transaction.response,
            tender: tenderId,
            product_review_date: selectedDate,
            product_review_date_status: 'waiting_for_host',
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
  const [activeButton, setActiveButton] = useState('details');
  const [activeContent, setActiveContent] = useState('details');
  const showContent = (contentId) => {
    setActiveContent(contentId);
    setActiveButton(contentId);
  };
  if (!data || !offer) {
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
    <>
      <div className="container_create_tender" style={{ marginRight: '-20px' }}>
        {
        offer.status === 'winner' && transaction && !transaction.product_review_date_status !== 'waiting_for_host' && (
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
                معلومات الاتصال
              </button>
            </div>
          </div>
        )
        }
        {offer.status === 'awarded' && (
          <div>
            <div className="center-content">
              <p style={{ fontSize: '20px' }} className="national">تهانينا لقد فزت بهذه المناقصه يرجي التاكيد لاستمرار باقي اجرائات المناقصة</p>
            </div>
            <div className="buttons_awating">
              <button
                style={{ padding: '12px', marginLeft: '150px', marginRight: '100px' }}
                type="submit"
                className="button_awating"
                onClick={(e) => {
                  e.preventDefault();
                  confirmNotification('confirmed');
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
                  confirmNotification('rejected');
                }}
              >
                رفض
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
                      min={minDate}
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
        {transaction && transaction.product_review_date_status === 'waiting_for_supplier' && (
          <div>
            <div className="center-content">
              <p style={{ fontSize: '20px' }} className="national">مالك المناقصة حدد موعد  {transaction.review_date_arabic} لمراجعة المنتجات لديكم يرجي التأكيد علي الموعد او اختيار موعد اخر</p>
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
                      min={minDate}
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
        {transaction && transaction.product_review_status === 'accepted' && (
          <div className="center-content">
            <p className="national">لقد وافق مالك المناقصة علي المنتجات بعد المراجعة</p>
          </div>
        )}
        {transaction && transaction.product_review_status === 'rejected' && (
          <div className="center-content">
            <p className="national">لقد رفض مالك المناقصة علي منتجات هذه المناقصة بعد المراجعة</p>
          </div>
        )}
        {offer.status === 'winner' && transaction && !transaction.product_review_date_status && !transaction.product_review_status && (
        <div className="center-content">
          <p className="national">تهانينا لقد فزت بهذه المناقصة</p>
        </div>
        )}
        {offer.status === 'candidate_pool' && (
        <div className="center-content">
          <p style={{ fontSize: '23px' }} className="national">تمت إضافه هذا العرض لقائمه المرشحين</p>
        </div>
        )}
        {transaction && transaction.product_review_date_status === 'accepted' && !transaction.product_review_status && (
        <div className="center-content">
          <p className="national"> تم تحديد يوم {transaction.review_date_arabic} لمراجعة المنتجات</p>
        </div>
        )}
        { offer.status === 'winner' && transaction && transaction.product_review_status === 'accepted' && (
          <button
            type="submit"
            className="button_awating"
            onClick={downloadPDF}
            style={{
              padding: '22px',
              display: 'inline-flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {loading ? 'جاري التحميل....' : 'حمل العقد'}
          </button>
        )}
        {activeContent === 'details' ? (

          <form>
            <div className="tender_announcement">
              <div className="gradient__text">
                <h1>إعلان  المناقصة</h1>
              </div>
              <div className="form-fields">
                <label htmlFor="tenderTitle">عنوان المناقصة
                  <input type="text" id="tenderTitle" value={data && data.ad.title} readOnly="readonly" />
                </label>
              </div>
              <div className="form-fields">
                <label htmlFor="tenderSubject">موضوع المناقصة
                  <textarea style={{ paddingRight: '17px' }} type="text" id="tenderSubject" defaultValue={data && data.ad.topic} readOnly="readonly" />
                </label>
              </div>
              <div className="form-fields">
                <label htmlFor="tenderSubject">مجال المناقصة
                  <textarea style={{ paddingRight: '17px' }} type="text" id="tenderField" value={data && data.ad.field} readOnly="readonly" />
                </label>
              </div>
              <div className="form-fields">
                <label htmlFor="tenderOpeningDate">اخر موعد لاستقبال العروض
                  <input id="tenderOpeningDate" value={data && data.ad.deadline_arabic} readOnly="readonly" />
                </label>
              </div>
            </div>
            <hr data-v-7e013592 />
            <div className="create_new_tender">
              <div className="gradient__text">
                <h1>منتجات المناقصه</h1>
              </div>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <th style={{ width: '0.1px' }} />
                    <th className="col-2">عنوان المنتج</th>
                    <th style={{ width: '0.8px' }}>وحدة الكمية</th>
                    <th style={{ width: '0.8px' }}>الكمية</th>
                    <th className="col-">وصف المنتج</th>
                    <th className="col-1">سعر الوحده</th>
                    <th className="col-2">حاله التوريد</th>
                  </tr>
                </thead>
                <tbody>
                  { offer && offer.offer_products.map((product, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>
                        <textarea
                          ref={(el) => { textareaRefs.current[idx] = el; }}
                          id={`title${idx}`}
                          value={product.title}
                          onChange={(e) => handleProductChange(idx, 'title', e.target.value)}
                          onInput={(e) => handleTextareaInput(e, idx)}
                          aria-label={`Title for Product ${product.id}`}
                        />
                      </td>
                      <td>
                        <textarea
                          style={{ alignItems: 'center', justifyContent: 'center' }}
                          readOnly="readonly"
                          ref={(el) => { textareaRefs.current[idx] = el; }}
                          id="unit"
                          value={product.quantity_unit}
                          onChange={(e) => handleProductChange(idx, 'unit', e.target.value)}
                          onInput={(e) => handleTextareaInput(e, idx)}
                          aria-label={`Unit for Product ${product.id}`}
                        />
                      </td>
                      <td>
                        <textarea
                          ref={(el) => { textareaRefs.current[idx] = el; }}
                          id="quantity"
                          value={product.provided_quantity}
                          onChange={(e) => {
                            handleProductChange(idx, 'quantity', e.target.value);
                          }}
                          onInput={(e) => {
                            handleTextareaInput(e, idx);
                            // calculateTotalPrice();
                          }}
                          aria-label={`Quantity for Product ${product.id}`}
                        />
                      </td>
                      <td>
                        <textarea
                          ref={(el) => { textareaRefs.current[idx] = el; }}
                          id={`description${idx}`}
                          value={product.product_description}
                          onChange={(e) => handleProductChange(idx, 'description', e.target.value)}
                          onInput={(e) => handleTextareaInput(e, idx)}
                          aria-label={`Description for Product ${product.id}`}
                        />
                      </td>
                      <td>
                        <textarea
                          value={product.price}
                          onChange={(e) => {
                            handleProductChange(idx, 'price', e.target.value);
                          }}
                          onInput={(e) => {
                            handleTextareaInput(e, idx);
                            // calculateTotalPrice();
                          }}
                          id={`price${idx}`}
                          aria-label={`Description for Product ${product.id}`}
                        />
                      </td>
                      <td>
                        <textarea
                          value={product.supplying_status}
                          aria-label={`supplying status for product ${product.id}`}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="form-fields col-md-3" style={{ marginTop: '20px', marginBottom: '10px' }}>
              <label htmlFor="create_tender">السعر المعروض للمناقصة بالكامل
                <input style={{ marginTop: '20px', marginBottom: '10px' }} value={offer.offered_price} type="number" id="offeredprice" />
              </label>
            </div>
            <hr data-v-7e013592 />
            <div className="gradient__text m-3">
              <h1 style={{ marginBottom: '0px' }}>الشروط العامة</h1>
              <h4 style={{ textAlign: 'center' }}>(غير قابله للتعديل من قبل المورد)</h4>
            </div>

            <div className="condition-section">
              { conditions && conditions.map((condition, idx) => (
                <div key={idx} className="private-condition-field">
                  <span className="condition-index">{idx + 1}.</span>
                  <input
                    type="text"
                    defaultValue={`${condition.condition}`}
                    onChange={(e) => handleConditionChange(idx, e.target.value)}
                    placeholder={` الشرط رقم ${idx + 1}`}
                    readOnly="readonly"
                  />
                </div>
              ))}
            </div>
            <hr data-v-7e013592 />
            <div className="gradient__text m-3">
              <h1>الشروط الخاصة</h1>
              <h4 style={{ textAlign: 'center' }}>(يمكن التعديل عليها من قبل المورد)</h4>
            </div>

            <div className="condition-section">
              { offer && offer.offer_conditions.map((privateCondition, idx) => (
                <div key={idx} className="private-condition-field">
                  <span className="condition-index">{idx + 1}.</span>
                  <input
                    type="text"
                    value={`${privateCondition.offered_condition}`}
                    onChange={(e) => handlePrivateConditionChange(idx, e.target.value)}
                    placeholder={` الشرط الخاص رقم ${idx + 1}`}
                    className="private-condition-input"
                  />
                </div>
              ))}
            </div>
            <div style={{ marginBottom: '70px' }}>
              {offer.previous_work.length > 0 && (
                <div className="gradient__text m-3">
                  <h1>الأعمال السابقة</h1>
                </div>
              )}
              {offer.previous_work.map((work, index) => (
                <div key={index}>
                  <div className="center-content">
                    <p className="national">المشروع رقم {index + 1}</p>
                  </div>
                  <label htmlFor="prevtenderTitle">عنوان المشروع
                    <input type="text" id="prevtenderTitle" value={work.title} onChange={(e) => handlePreviousWorkChange(index, 'title', e.target.value)} />
                  </label>
                  <label htmlFor="prevtenderSubject">موضوع المشروع
                    <textarea
                      style={{ paddingRight: '17px' }}
                      type="text"
                      id={`prevtenderSubject${index}`}
                      value={work.description}
                      onInput={(e) => handleWorkTextArea(e, index)}
                      onChange={(e) => handlePreviousWorkChange(index, 'description', e.target.value)}
                    />
                  </label>
                </div>
              ))}
              {!showAddProjectButton && (
                <button
                  type="button"
                  style={{ alignItems: 'center' }}
                  className="button condition"
                  onClick={handleAddProject}
                >
                  اضافه مشروع
                </button>
              )}
            </div>
          </form>
        ) : (HostDetails && (
          <div style={{ marginLeft: '80px' }}>
            <div className="gradient__text">
              <h1 className="account_h1">بيانات المورد</h1>
            </div>
            <div className="row">
              <div className="form-group col-md-6">
                <label htmlFor="First_Name">الاسم الاول
                  <input type="text" name="First_Name" id="First_Name" value={HostDetails.user.first_name} />
                </label>
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="Second_Name">الاسم الثاني
                  <input type="text" name="Second_Name" id="Second_Name" value={HostDetails.user.last_name} />
                </label>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="email">البريد الالكتروني
                <input type="text" name="email" id="email" value={HostDetails.user.email} />
              </label>
            </div>
            <div className="gradient__text">
              <h1>بيانات الشركة</h1>
            </div>
            <div className="form-group">
              <label htmlFor="companyName">اسم الشركة
                <input className="input-margin" type="text" name="companyName" id="companyName" value={HostDetails.name} />
              </label>
            </div>
            <div className="form-group">
              <label htmlFor="address">العنوان على الخريطة (اللوكيشن)
                <input className="input-margin" type="text" name="address" id="address" value={HostDetails.location} />
              </label>
            </div>
            <div className="row">
              {/* <div className="form-group col-md-4">
                <label htmlFor="commercialRegistrationNumber">رقم السجل التجاري
                  <input className="input-margin" type="text" name="commercialRegistrationNumber" id="commercialRegistrationNumber" value={HostDetails.supplier.commercial_registration_number} />
                </label>
              </div> */}
              {/* <div className="form-group col-md-4">
                <label htmlFor="taxCardNumber">رقم البطاقة الضريبية
                  <input className="input-margin" type="text" name="taxCardNumber" id="taxCardNumber" value={HostDetails.supplier.tax_card_number} />
                </label>
              </div> */}
              <div className="form-group col-md-6">
                <label htmlFor="registrationAuthority">جهة استخراج السجل التجاري
                  <input className="input-margin" type="text" name="registrationAuthority" id="registrationAuthority" value={HostDetails.city} />
                </label>
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="fax">فاكس
                  <input className="input-margin" type="text" name="fax" id="fax" value={HostDetails.fax_number} />
                </label>
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-6">
                <label htmlFor="mobile">موبايل
                  <input className="input-margin" type="text" name="mobile" id="mobile" value={HostDetails.mobile} />
                </label>
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="landline">تليفون أرضي
                  <input className="input-margin" type="text" name="landline" id="landline" value={HostDetails.landline} />
                </label>
              </div>

            </div>
            <div className="row">
              {/* <div className="form-group col-md-6">
                <label htmlFor="companyType">نوع الشركة
                  <input className="input-margin" type="text" name="fax" id="fax" value={HostDetails.supplier.company_type} />
                </label>
              </div> */}
              {/* <div className="form-group col-md-6">
                <label htmlFor="capital">رأس مال الشركة من واقع السجل التجاري بالجنيه المصري
                  <input className="input-margin" type="text" name="capital" id="capital" value={HostDetails.supplier.company_capital} />
                </label>
              </div> */}
            </div>
            <hr data-v-7e013592 />
            <div style={{ marginBottom: '50px' }}>
              {HostDetails.owners.length > 0 && (
                <div className="gradient__text">
                  <h1>ملاك / اعضاء الشركة</h1>
                </div>
              )}
              {HostDetails.owners.map((admin, index) => (
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
    </>
  );
}

export default Response;
