/* eslint-disable no-restricted-syntax */
/* eslint-disable arrow-parens */
/* eslint-disable quotes */
/* eslint-disable no-else-return */
/* eslint-disable no-unused-vars */
import React, { useState, useContext, useRef, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import PulseLoader from 'react-spinners/PulseLoader';
import AuthContext from '../../../context/Authcontext';
// import './AddResponse.css';

function CancelledTenderDetails() {
  const { id } = useParams();
  const navigate = useHistory();
  const { authTokens } = useContext(AuthContext);
  const [tender, setTender] = useState(null);
  const [officials, setOfficials] = useState(['']);
  const [officialIndex, setOfficialIndex] = useState(1);
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [tenderadFormData, setTenderadFormData] = useState({
    title: '',
    topic: '',
    deadline: '',
    field: '',
    finalInsurance: '',
  });
  useEffect(() => {
    // Get the current date
    const today = new Date();
    // Format the date as yyyy-mm-dd
    const formattedMinDate = today.toISOString().split('T')[0];
    console.log(formattedMinDate);
    const nextYear = new Date(today);
    nextYear.setFullYear(today.getFullYear() + 1);
    const formattedMaxDate = nextYear.toISOString().split('T')[0];

    setMinDate(formattedMinDate);
    setMaxDate(formattedMaxDate);
    // Set the minDate state
  }, []);
  useEffect(() => {
    // This effect will run every time the location changes
    const unlisten = navigate.listen(() => {
      window.scrollTo(0, 0);
    });
    return () => {
      unlisten();
    };
  }, [navigate]);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const handleAddOfficial = () => {
    const newOfficial = { name: '', job_title: '' };
    setOfficials([...officials, newOfficial]);
    setOfficialIndex(officialIndex + 1);
    console.log(officials);
  };

  const handleOfficialChange = (idx, field, value) => {
    const updatedOfficials = [...officials];
    updatedOfficials[idx][field] = value;
    setOfficials(updatedOfficials);
  };
  const [products, setProducts] = useState(tender && tender.products);
  // const [descriptions, setDescriptions] = useState(['']);
  // const [index, setIndex] = useState(1);
  const [conditions, setConditions] = useState(['']);
  const [privateconditions, setPrivateConditions] = useState(['']);
  const [selectedTender, setSelectedTender] = useState('');
  const [selectedFinalPercentage, setSelectedPercentage] = useState('');
  const [submitType, setSubmitType] = useState('');
  let hasErrors = false;

  const handleSelectChange = (event) => {
    setSelectedTender(event.target.value);
  };
  const handleSelectPercentageChange = (event) => {
    setSelectedPercentage(event.target.value);
  };
  const handleAddProduct = () => {
    const newProduct = { title: '', quantity_unit: '', quantity: '', description: '' };
    setProducts([...products, newProduct]);
    console.log(products);
    // setDescriptions([...descriptions, '']);
    // setIndex(index + 1);
  };

  // const handleAddProduct = () => {
  //   const newProduct = { id: index + 1, title: '', unit: '', quantity: '' };
  //   setProducts([...products, newProduct]);
  //   setDescriptions([...descriptions, '']);
  //   setIndex(index + 1);
  // };

  const handleProductChange = (idx, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[idx][field] = value;
    setProducts(updatedProducts);
  };

  // const handleDescriptionChange = (idx, value) => {
  //   const updatedDescriptions = [...descriptions];
  //   updatedDescriptions[idx] = value;
  //   setDescriptions(updatedDescriptions);
  // };

  // const handleTitleChange = (idx, value) => {
  //   const updatedProducts = [...products];
  //   updatedProducts[idx].title = value;
  //   setProducts(updatedProducts);
  // };

  const handleAddCondition = () => {
    const newCondition = { condition: '' };
    setConditions([...conditions, newCondition]);
    console.log(conditions);
  };

  const handleAddPrivateCondition = () => {
    const newCondition = { condition: '' };
    setPrivateConditions([...privateconditions, newCondition]);
    console.log(privateconditions);
  };

  const handleConditionChange = (idx, value) => {
    const updatedConditions = [...conditions];
    updatedConditions[idx].condition = value;
    setConditions(updatedConditions);
  };

  const handlePrivateConditionChange = (idx, value) => {
    const updatedPrivateConditions = [...privateconditions];
    updatedPrivateConditions[idx].condition = value;
    setPrivateConditions(updatedPrivateConditions);
  };

  useEffect(() => {
    if (tender) {
      setTenderadFormData({
        title: tender.ad.title,
        topic: tender.ad.topic,
        deadline: tender.ad.deadline,
        field: tender.ad.field,
        finalInsurance: tender.ad.finalInsurance,
      });
    }
  }, [tender]);
  const handleTextArea = (event) => {
    const textarea = event.target;
    textarea.style.height = 'auto'; // Reset height to auto to measure content
    textarea.style.height = `${textarea.scrollHeight}px`; // Set height to fit content
  };
  const handleChangeAd = (e) => {
    const { name, value } = e.target;
    if (name === 'deadline') {
      const date = e.target.value;
      if (date < minDate) {
        setError('يرجي اختيار موعد قادم صحيح');
      } else if (date > maxDate) {
        setError(`يرجي اختيار موعد قبل ${formatDate(maxDate)}`);
      } else {
        setError('');
      }
    }
    handleTextArea(e);
    setTenderadFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    console.log(tenderadFormData);
  };
  const handleDateTwoMethods = (e) => {
    const date = e.target.value;
    handleChangeAd(e);
    // Check if the selected date is before the min date
    console.log(date);
    console.log(minDate);
    if (date < minDate) {
      setError('يرجي اختيار موعد قادم صحيح');
    } else if (date > maxDate) {
      setError(`يرجي اختيار موعد قبل ${formatDate(maxDate)}`);
    } else {
      setError('');
    }
  };
  const [errors, setErrors] = useState({});
  const validate = (e) => {
    const newErrors = {
      products: [],
      description: [],
      admins: [],
      public_conditions: [],
      private_conditions: [],
    };
    if (!tenderadFormData.title) {
      hasErrors = true;
      newErrors.title = 'عنوان المناقصة مطلوب';
    }
    if (!tenderadFormData.topic) {
      hasErrors = true;
      newErrors.topic = 'موضوع المناقصة مطلوب';
    }
    if (!tenderadFormData.field) {
      hasErrors = true;
      newErrors.field = 'مجال المناقصة مطلوب';
    }
    if (!tenderadFormData.finalInsurance) {
      hasErrors = true;
      newErrors.finalInsurance = 'نسبة التأمين النهائي مطلوب';
    }
    if (!tenderadFormData.deadline) {
      hasErrors = true;
      newErrors.deadline = ' معاد فتح المظاريف مطلوب';
    }
    products.forEach((product, idx) => {
      if (!product.title) {
        hasErrors = true;
        if (!newErrors.products[idx]) newErrors.products[idx] = {};
        newErrors.products[idx].title = 'مطلوب';
      }
      if (!product.quantity) {
        hasErrors = true;
        if (!newErrors.products[idx]) newErrors.products[idx] = {};
        newErrors.products[idx].quantity = 'مطلوبة';
      }
      if (!product.quantity_unit) {
        hasErrors = true;
        if (!newErrors.products[idx]) newErrors.products[idx] = {};
        newErrors.products[idx].quantity_unit = 'مطلوبة';
      }
      if (!product.description) {
        hasErrors = true;
        if (!newErrors.products[idx]) newErrors.products[idx] = {};
        newErrors.products[idx].description = 'مطلوب';
      }
    });

    officials.forEach((official, idx) => {
      if (!newErrors.admins[idx]) newErrors.admins[idx] = {};

      if (!official.name) {
        hasErrors = true;
        newErrors.admins[idx].name = 'اسم المسوؤل مطلوب';
      }

      if (!official.job_title) {
        hasErrors = true;
        newErrors.admins[idx].position = 'المنصب مطلوب';
      }
    });
    conditions.forEach((condition, idx) => {
      if (!newErrors.public_conditions[idx]) newErrors.public_conditions[idx] = {};
      if (!condition.condition) {
        hasErrors = true;
        newErrors.public_conditions[idx].condition = 'هذا الشرط مطلوب';
      }
    });
    privateconditions.forEach((condition, idx) => {
      if (!newErrors.private_conditions[idx]) newErrors.private_conditions[idx] = {};
      if (!condition.condition) {
        hasErrors = true;
        newErrors.private_conditions[idx].condition = 'هذا الشرط مطلوب';
      }
    });
    return newErrors;
  };
  const textareaRefs = useRef([]);
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
        const response = await fetch(`http://localhost:8000/get_tender/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authTokens.access}`,
          },
        });

        const tender1 = await response.json();
        console.log('tender1', tender1);
        setTender(tender1);
        setProducts(tender1.products);
        setConditions(tender1.public_conditions);
        setOfficials(tender1.admins);
        setPrivateConditions(tender1.private_conditions);
        setSelectedPercentage(tender1.ad.finalInsurance);
        setSelectedTender(tender1.ad.field);

        const adjustTextareaHeight = () => {
          const textarea = document.getElementById('tenderSubject');
          if (textarea) {
            textarea.style.height = 'auto'; // Reset height to auto to measure content
            textarea.style.height = `${textarea.scrollHeight}px`; // Set height to fit content
          }
          /* eslint-disable-next-line no-plusplus */
          for (let i = 0; i < tender1.products.length; i++) {
            const textAreaTitle = document.getElementById(`title${i}`);
            const textAreaDescription = document.getElementById(`description${i}`);

            if (textAreaTitle) {
              textAreaTitle.style.height = 'auto'; // Reset height to auto to measure content
              textAreaTitle.style.height = `${textAreaTitle.scrollHeight}px`;
            }

            if (textAreaDescription) {
              textAreaDescription.style.height = 'auto'; // Reset height to auto to measure content
              textAreaDescription.style.height = `${textAreaDescription.scrollHeight}px`;
            }
          }
        };

        // Call the function to adjust textarea height on component mount
        adjustTextareaHeight();
      } catch (er) {
        console.error('Error fetching tenders:', er);
      }
    };
    fetchTenders();
  }, [authTokens]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (submitType === 'open') {

    // }

    try {
      // console.log(e.target.querySelector('#tenderTitle').value);
      // console.log(e.target.querySelector('#tenderSubject').value);
      // console.log(e.target.querySelector('#tenderOpeningDate').value);
      // console.log(e.target.querySelector('#create_tender').value);
      // console.log(e.target.querySelector('#tenderTitle').value);
      console.log(submitType);
      const formData = {
        ad: tenderadFormData,
        admins: officials,
        public_conditions: conditions,
        private_conditions: privateconditions,
        products,
        status: submitType,
        id: tender.id,
      };
      const dataToSubmit = { ...formData };

      if (!dataToSubmit.ad.finalInsurance) {
        delete dataToSubmit.ad.finalInsurance;
      }
      if (!dataToSubmit.ad.deadline) {
        delete dataToSubmit.ad.deadline;
      }
      console.log(dataToSubmit);

      const checkForErrors = (obj) => {
        if (Array.isArray(obj)) {
          for (const item of obj) {
            if (typeof item === 'object' && item !== null) {
              if (checkForErrors(item)) return true;
            } else if (item === null || item === "") {
              return true;
            }
          }
        } else if (typeof obj === 'object' && obj !== null) {
          for (const key in obj) {
            if (obj[key] === null || obj[key] === "") {
              return true;
            }
          }
        } else if (obj === null || obj === "") {
          return true;
        }
        return false;
      };
      const validationErrors = validate(e);
      let hasErrors2 = false;
      for (const key in validationErrors) {
        if (checkForErrors(validationErrors[key])) {
          hasErrors2 = true;
          break;
        }
      }
      if (!hasErrors && !hasErrors2) {
        const response = await fetch('http://localhost:8000/create_tender/', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authTokens.access}`,
          },
          body: JSON.stringify(dataToSubmit),
        });
        if (response.ok) {
          console.log('Data sent successfully');
          if (submitType === 'draft') {
            navigate.push('/draft_tenders');
          } else {
            navigate.push('/mytender');
          }
          // You can reset form state or take other actions if needed
        } else {
          console.error('Failed to send data to server', response.json());
        }
      } else {
        setErrors(validationErrors);
        console.error(validationErrors);
      }
    } catch (er) {
      console.error('Error:', er);
    }
  };
  const SetTenderToOpen = async () => {
    try {
      // Assign 'candidate_pool' to the status variable

      // Send only the status in the request body
      const response = await fetch(
        `http://localhost:8000/update_tender_status/?tender_id=${id}&new_status=open`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authTokens.access}`,
          },
        },
      );

      const data = await response.json();
      if (response.ok) {
        navigate.push(`/mytender`);
      }
    } catch (errr) {
      console.error('Error sending response:', errr);
    }
  };
  const SetTenderToDraft = async () => {
    const response = await fetch(
      `http://localhost:8000/update_tender_status/?tender_id=${id}&new_status=draft`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authTokens.access}`,
        },
      },
    );

    const data = await response.json();

    if (response.ok) {
      navigate.push(`/draft_tender_details/${id}`);
    }

    console.log(data);
    // histoyty.push(`/awating_responses/${id}`);
  };
  if (!tender) {
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
      <div className="container_create_tender">
        <form onSubmit={handleSubmit}>
          <div className="tender_announcement">
            <div className="gradient__text">
              <h1>إعلان  المناقصة</h1>
            </div>
            <div className="form-fields">
              <label htmlFor="tenderTitle">عنوان المناقصة
                <input
                  type="text"
                  name="title"
                  id="tenderTitle"
                  // value={tenderadFormData.title}
                  value={tender.ad.title}
                />
              </label>
              {errors.title && <p style={{ fontSize: '20px', color: 'red' }}>{errors.title}</p>}

            </div>
            <div className="form-fields">
              <label htmlFor="tenderSubject">موضوع المناقصة
                <textarea style={{ paddingRight: '17px' }} type="text" name="topic" id="tenderSubject" value={tender.ad.topic} />
              </label>
              {errors.topic && <p style={{ fontSize: '20px', color: 'red' }}>{errors.topic}</p>}
            </div>
            {/* <div className="form-fields col-8">
              <label htmlFor="preInsurance">نسبه التأمين الابتدائي
                <select value={selectedTender} onChange={handleSelectChange}>
                  <option value="">اختر نسبة التأمين الإبتدائي </option>
                  <option value="0.5">0.5%</option>
                  <option value="1.0">1%</option>
                  <option value="1.5">1%</option>
                </select>
              </label>
            </div> */}
            <div className="form-fields">
              <label htmlFor="preInsurance"> نسبه التأمين النهائي <span style={{ fontSize: 'small' }}> **نسبه التأمين النهائي تحتسب من سعر العرض الفائز **</span>
                <input value={`${tender.ad.finalInsurance}%`} name="finalInsurance" />
              </label>
              {errors.finalInsurance && <p style={{ fontSize: '20px', color: 'red' }}>{errors.finalInsurance}</p>}
            </div>
            <div className="form-fields">
              <label htmlFor="tenderSubject">مجال المناقصة
                <input name="field" value={tender.ad.field} />
              </label>
              {errors.field && <p style={{ fontSize: '20px', color: 'red' }}>{errors.field}</p>}

            </div>
            <div className="form-fields">
              <label htmlFor="tenderOpeningDate">
                معاد فتح المظاريف
                <input
                  type="date"
                  id="tenderOpeningDate"
                  name="deadline"
                  value={tender.ad.deadline}
                  // value={selectedDate}
                />
              </label>
              {error && <p style={{ color: 'red' }}>{error}</p>}
              {errors.deadline && <p style={{ fontSize: '20px', color: 'red' }}>{errors.deadline}</p>}
            </div>
          </div>
          <div className="bidding_officials">
            <div className="gradient__text">
              <h1>مسوؤلي المناقصة</h1>
            </div>
            {officials.map((official, idx) => (
              <div key={idx} className="form-fields row" style={{ marginBottom: '20px' }}>
                <div className="col-md-6">
                  <label htmlFor={`officialName_${idx}`}>الاسم
                    <input
                      type="text"
                      id={`officialName_${idx}`}
                      value={official.name}
                    />
                  </label>
                  {errors.admins && errors.admins[idx] && errors.admins[idx].name && (
                    <p style={{ fontSize: '20px', color: 'red' }}>
                      {errors.admins[idx].name}
                    </p>
                  )}
                </div>
                <div className="col-md-6">
                  <label htmlFor={`officialPosition_${idx}`}>الوظيفة
                    <input
                      type="text"
                      id={`officialPosition_${idx}`}
                      value={official.job_title}
                    />
                  </label>
                  {errors.admins && errors.admins[idx] && errors.admins[idx].position && (
                    <p style={{ fontSize: '20px', color: 'red' }}>
                      {errors.admins[idx].position}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="create_new_tender">
            <div className="gradient__text">
              <h1>عمل مناقصة جديدة</h1>
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <th style={{ width: '1px' }}>الصف</th>
                  <th className="col-2">عنوان المنتج</th>
                  <th className="col-1">وحدة الكمية</th>
                  <th className="col-1">الكمية</th>
                  <th className="col-">وصف المنتج</th>
                </tr>
              </thead>
              <tbody>
                { products && products.map((product, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td style={{ position: 'relative', paddingBottom: '20px' }}>
                      <textarea
                        ref={(el) => { textareaRefs.current[idx] = el; }}
                        id={`title${idx}`}
                        value={product.title}
                        style={{ width: '100%' }} // Ensure the textarea takes full width
                      />
                      {errors.products && errors.products[idx] && errors.products[idx].title && (
                        <p style={{ fontSize: '12px', color: 'red', position: 'absolute', bottom: '0px' }}>
                          {errors.products[idx].title}
                        </p>
                      )}
                    </td>
                    <td style={{ position: 'relative', paddingBottom: '20px' }}>
                      <textarea
                        style={{ alignItems: 'center', justifyContent: 'center' }}
                        ref={(el) => { textareaRefs.current[idx] = el; }}
                        id="unit"
                        value={product.quantity_unit}

                      />
                      {errors.products && errors.products[idx] && errors.products[idx].quantity_unit && (
                        <p style={{ fontSize: '12px', color: 'red', position: 'absolute', bottom: '0px' }}>
                          {errors.products[idx].quantity_unit}
                        </p>
                      )}
                    </td>
                    <td style={{ position: 'relative', paddingBottom: '20px' }}>
                      <textarea
                        ref={(el) => { textareaRefs.current[idx] = el; }}
                        id="quantity"
                        value={product.quantity}
                      />
                      {errors.products && errors.products[idx] && errors.products[idx].quantity && (
                        <p style={{ fontSize: '12px', color: 'red', position: 'absolute', bottom: '0px' }}>
                          {errors.products[idx].quantity}
                        </p>
                      )}
                    </td>
                    <td style={{ position: 'relative', paddingBottom: '20px' }}>
                      <textarea
                        ref={(el) => { textareaRefs.current[idx] = el; }}
                        id={`description${idx}`}
                        value={product.description}
                      />
                      {errors.products && errors.products[idx] && errors.products[idx].description && (
                        <p style={{ fontSize: '12px', color: 'red', position: 'absolute', bottom: '0px' }}>
                          {errors.products[idx].description}
                        </p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* <hr data-v-7e013592 /> */}
          <div className="gradient__text m-3">
            <h1>الشروط العامة</h1>
          </div>

          <div className="condition-section">
            {conditions.map((condition, idx) => (
              <div key={idx} className="condition-field1">
                <input
                  type="text"
                  value={condition.condition}
                  placeholder={` الشرط رقم ${idx + 1}`}
                />
                {errors.public_conditions && errors.public_conditions[idx] && errors.public_conditions[idx].condition && <p style={{ fontSize: '20px', color: 'red' }}>{errors.public_conditions[idx].condition}</p>}

              </div>
            ))}
          </div>

          <div className="gradient__text m-3">
            <h1>الشروط الخاصة</h1>
          </div>

          <div className="condition-section">
            {privateconditions.map((privateCondition, idx) => (
              <div key={idx} className="condition-field1">
                <input
                  type="text"
                  value={privateCondition.condition}
                  placeholder={` الشرط الخاص رقم ${idx + 1}`}
                />
                {errors.private_conditions && errors.private_conditions[idx] && errors.private_conditions[idx].condition && <p style={{ fontSize: '20px', color: 'red' }}>{errors.private_conditions[idx].condition}</p>}

              </div>
            ))}
          </div>

          <div className="button-container">
            <button
              style={{ marginRight: '150px', marginLeft: '150px' }}
              className="buton_resonpose"
              type="button"
              onClick={SetTenderToOpen}
            >
              إعاده نشر المناقصة
            </button>
            <button
              style={{ marginLeft: '150px' }}
              className="button"
              type="button"
              onClick={SetTenderToDraft}
            >
              تعديل المناقصة
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
export default CancelledTenderDetails;
