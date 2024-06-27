/* eslint-disable operator-linebreak */
/* eslint-disable no-unused-vars */
import React, { useState, useContext, useRef, useEffect } from 'react';
import './createtender.css';
import { useHistory } from 'react-router-dom';
import PulseLoader from 'react-spinners/PulseLoader';

import AuthContext from '../../../context/Authcontext';

function CreateTender() {
  const navigate = useHistory();
  const { authTokens } = useContext(AuthContext);
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

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
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
  const [officials, setOfficials] = useState([
    { id: 1, name: '', position: '' },
  ]);
  const [officialIndex, setOfficialIndex] = useState(1);

  const handleAddOfficial = () => {
    const newOfficial = { id: officialIndex + 1, name: '', position: '' };
    setOfficials([...officials, newOfficial]);
    setOfficialIndex(officialIndex + 1);
  };

  const handleOfficialChange = (idx, field, value) => {
    const updatedOfficials = [...officials];
    updatedOfficials[idx][field] = value;
    setOfficials(updatedOfficials);
  };
  const [products, setProducts] = useState([
    { id: 1, title: '', unit: '', quantity: '' },
  ]);
  const [descriptions, setDescriptions] = useState(['']);
  const [index, setIndex] = useState(1);
  const [conditions, setConditions] = useState([{ id: 1, value: '' }]);
  const [privateconditions, setPrivateConditions] = useState([{ id: 1, value: '' }]);
  const [selectedTender, setSelectedTender] = useState('');
  const [selectedFinalPercentage, setSelectedPercentage] = useState('');
  const [submitType, setSubmitType] = useState('');

  const handleSelectChange = (event) => {
    setSelectedTender(event.target.value);
  };
  const handleSelectPercentageChange = (event) => {
    setSelectedPercentage(event.target.value);
  };

  const handleAddProduct = () => {
    const newProduct = { id: index + 1, title: '', unit: '', quantity: '' };
    setProducts([...products, newProduct]);
    setDescriptions([...descriptions, '']);
    setIndex(index + 1);
  };

  const handleProductChange = (idx, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[idx][field] = value;
    setProducts(updatedProducts);
  };

  const handleDescriptionChange = (idx, value) => {
    const updatedDescriptions = [...descriptions];
    updatedDescriptions[idx] = value;
    setDescriptions(updatedDescriptions);
  };

  const handleTitleChange = (idx, value) => {
    const updatedProducts = [...products];
    updatedProducts[idx].title = value;
    setProducts(updatedProducts);
  };

  const handleAddCondition = () => {
    const newCondition = { id: conditions.length + 1, value: '' };
    setConditions([...conditions, newCondition]);
  };

  const handleAddPrivateCondition = () => {
    const newCondition = { id: privateconditions.length + 1, value: '' };
    setPrivateConditions([...privateconditions, newCondition]);
  };

  const handleConditionChange = (idx, value) => {
    const updatedConditions = [...conditions];
    updatedConditions[idx].value = value;
    setConditions(updatedConditions);
  };

  const handlePrivateConditionChange = (idx, value) => {
    const updatedPrivateConditions = [...privateconditions];
    updatedPrivateConditions[idx].value = value;
    setPrivateConditions(updatedPrivateConditions);
  };
  const textareaRef = useRef(Array.from({ length: 4 }, () => React.createRef()));
  const handleInput = (indexx) => {
    const textarea = textareaRef.current[indexx].current;
    textarea.style.height = 'auto'; // Reset height to auto to measure content
    textarea.style.height = `${textarea.scrollHeight}px`; // Set height to fit content
  };

  const handleSubjectInput = () => {
    const textarea = document.getElementById('tenderSubject');
    if (textarea) {
      textarea.style.height = 'auto'; // Reset height to auto to measure content
      textarea.style.height = `${textarea.scrollHeight}px`; // Set height to fit content
    }
  };
  const [tenderadFormData, setTenderadFormData] = useState({
    title: '',
    topic: '',
    deadline: '',
    field: '',
    finalInsurance: '',
  });
  const handleTextArea = (event) => {
    const textarea = event.target;
    textarea.style.height = 'auto'; // Reset height to auto to measure content
    textarea.style.height = `${textarea.scrollHeight}px`; // Set height to fit content
  };

  const [errors, setErrors] = useState({});
  let hasErrors = false;
  const validate = (e) => {
    const newErrors = {
      products: [],
      description: [],
      admins: [],
      public_conditions: [],
      private_conditions: [],
    };
    hasErrors = false;
    if (!tenderadFormData.title) {
      hasErrors = true;
      console.log('title');
      newErrors.title = 'عنوان المناقصة مطلوب';
    }
    if (!tenderadFormData.topic) {
      hasErrors = true;
      console.log('topic');

      newErrors.topic = 'موضوع المناقصة مطلوب';
    }
    if (!tenderadFormData.field) {
      hasErrors = true;
      console.log('title');

      newErrors.field = 'مجال المناقصة مطلوب';
    }
    if (!tenderadFormData.finalInsurance) {
      hasErrors = true;
      console.log('title');
      newErrors.finalInsurance = 'نسبة التأمين النهائي مطلوب';
    }
    if (!tenderadFormData.deadline) {
      console.log('title');
      hasErrors = true;
      newErrors.deadline = 'اخر موعد لتلقي العروض مطلوب';
    }
    products.forEach((product, idx) => {
      if (!product.title) {
        if (!newErrors.products[idx]) newErrors.products[idx] = {};
        console.log('title');
        hasErrors = true;
        newErrors.products[idx].title = 'مطلوب';
      }
      if (!product.quantity) {
        if (!newErrors.products[idx]) newErrors.products[idx] = {};
        console.log('title');
        hasErrors = true;
        newErrors.products[idx].quantity = 'مطلوبة';
      }
      if (!product.unit) {
        if (!newErrors.products[idx]) newErrors.products[idx] = {};
        console.log('title');
        hasErrors = true;
        newErrors.products[idx].unit = 'مطلوبة';
      }
    });
    descriptions.forEach((desc, idx) => {
      if (!desc) {
        hasErrors = true;
        console.log('title');
        newErrors.products[idx].description = 'مطلوب';
      }
    });
    officials.forEach((official, idx) => {
      if (!newErrors.admins[idx]) {
        newErrors.admins[idx] = {};
      }

      if (!official.name) {
        hasErrors = true;
        newErrors.admins[idx].name = 'اسم المسوؤل مطلوب';
      }

      if (!official.position) {
        hasErrors = true;
        newErrors.admins[idx].position = 'المنصب مطلوب';
      }
    });
    conditions.forEach((condition, idx) => {
      if (!newErrors.public_conditions[idx]) newErrors.public_conditions[idx] = {};
      if (!condition.value) {
        hasErrors = true;
        newErrors.public_conditions[idx].condition = 'هذا الشرط مطلوب';
      }
    });
    privateconditions.forEach((condition, idx) => {
      if (!newErrors.private_conditions[idx]) newErrors.private_conditions[idx] = {};
      if (!condition.value) {
        hasErrors = true;
        newErrors.private_conditions[idx].condition = 'هذا الشرط مطلوب';
      }
    });
    return newErrors;
  };
  const [loading, setLoading] = useState(false);
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitType === 'open') {
      const validationErrors = validate(e);
      console.log(hasErrors);
      if (!hasErrors) {
        console.log('Form published:', validationErrors);
        setLoading(true);
      } else {
        alert('يرجي إكمال بيانات المناقصة');
        setErrors(validationErrors);
        console.error(validationErrors);
        return;
      }
    }
    // Fetch form values
    const tenderTitle = e.target.querySelector('#tenderTitle').value;
    const tenderSubject = e.target.querySelector('#tenderSubject').value;
    const tenderOpeningDate = e.target.querySelector('#tenderOpeningDate').value;

    const cleanedTenderAd = Object.fromEntries(
      Object.entries(tenderadFormData).filter(([_, value]) => value !== '' && value !== null),
    );
    const initialPrice = 90;
    try {
      const formData = {
        ad: cleanedTenderAd,
        admins: officials.map((official) => ({
          name: official.name,
          job_title: official.position,
        })),
        public_conditions: conditions.map((condition) => ({
          condition: condition.value,
        })),
        private_conditions: privateconditions.map((condition) => ({
          condition: condition.value,
        })),
        products: products.map((product, idx) => ({
          title: product.title,
          quantity_unit: e.target.querySelector(`#unit_${idx}`).value,
          quantity: e.target.querySelector(`#quantity_${idx}`).value,
          description: e.target.querySelector(`#description_${idx}`).value,
        })),
        initial_price: initialPrice,
        status: submitType,
      };
      const dataToSubmit = { ...formData };

      // Remove initial_price if it's null or empty
      if (!dataToSubmit.initial_price) {
        delete dataToSubmit.initial_price;
      }
      if (!dataToSubmit.ad.finalInsurance) {
        delete dataToSubmit.ad.finalInsurance;
      }
      if (!dataToSubmit.ad.deadline) {
        delete dataToSubmit.ad.deadline;
      }
      const response = await fetch('http://localhost:8000/create_tender/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authTokens.access}`,
        },
        body: JSON.stringify(dataToSubmit),
      });
      if (response.ok) {
        console.log('Data sent successfully');
        navigate.push('/mytender');
        // You can reset form state or take other actions if needed
      } else {
        const errorResponse = await response.json();
        console.error('Failed to send data to server', errorResponse);
      }
    } catch (errror) {
      console.error('Error:', errror);
    }
  };
  if (!tenderadFormData) {
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
                <input type="text" name="title" id="tenderTitle" value={tenderadFormData.title} onChange={handleChangeAd} />
              </label>
              {errors.title && <p style={{ fontSize: '20px', color: 'red' }}>{errors.title}</p>}

            </div>
            <div className="form-fields">
              <label htmlFor="tenderSubject">موضوع المناقصة
                <textarea style={{ paddingRight: '17px' }} type="text" name="topic" id="tenderSubject" onChange={handleChangeAd} value={tenderadFormData.topic} />
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
              <label htmlFor="preInsurance"> نسبة التأمين النهائي <span style={{ fontSize: 'small' }}> **نسبه التأمين النهائي تحتسب من سعر العرض الفائز **</span>
                <select id="selectedFinalPercentage" value={tenderadFormData.finalInsurance} name="finalInsurance" onChange={handleChangeAd}>
                  <option value="">اختر نسبة التأمين النهائي </option>
                  <option value="2">2%</option>
                  <option value="2.5">2.5%</option>
                  <option value="3">3%</option>
                  <option value="3.5">3.5%</option>
                  <option value="4">4%</option>
                  <option value="4.5">4.5%</option>
                  <option value="5">5%</option>
                </select>
              </label>
              {errors.finalInsurance && <p style={{ fontSize: '20px', color: 'red' }}>{errors.finalInsurance}</p>}
            </div>
            <div className="form-fields">
              <label htmlFor="tenderSubject">مجال المناقصة
                <select value={tenderadFormData.field} onChange={handleChangeAd} name="field" id="selectedTender">
                  <option value="">اختر مجال</option>
                  <option value="اجهزه حاسب الي وسوفت وير">اجهزه حاسب الي وسوفت وير</option>
                  <option value="اجهزه رياضيه والعاب ترفيهية">اجهزه رياضيه والعاب ترفيهية</option>
                  <option value="اجهزه هيدورليك ومعدات ثقيله">اجهزه هيدورليك ومعدات ثقيله</option>
                  <option value="منتجات غذائيه">منتجات غذائيه</option>
                  <option value="منتجات مقاولات">منتجات مقاولات</option>
                  <option value="خدمات ماليه وبنوك">خدمات ماليه وبنوك</option>
                  <option value="منتجات الدعايه والاعلان">منتجات الدعايه والاعلان</option>
                  <option value="منتجات اثاث">منتجات اثاث</option>
                  <option value="ادوات مكتبيه">ادوات مكتبيه</option>
                  <option value="معدات بحريه">معدات بحريه</option>
                  <option value="مواد خام( معادن – اخشاب – نحاس – فضه – حديد -.....)">مواد خام( معادن – اخشاب – نحاس – فضه – حديد -.....)</option>
                  <option value="محابس">محابس</option>
                  <option value="اجهزه كهربائيه">اجهزه كهربائيه</option>
                  <option value="اجهزه رياضيه">اجهزه رياضيه</option>
                  <option value="اعلاف للحيوانات">اعلاف للحيوانات</option>
                  <option value="عدد ومسلتزمات ورش">عدد ومسلتزمات ورش</option>
                  <option value="منتجات الطاقه الشمسيه">منتجات الطاقه الشمسيه</option>
                  <option value="ادوات النظافه">ادوات النظافه</option>
                  <option value="منتجات التبريد والتكييف">منتجات التبريد والتكييف</option>
                </select>
              </label>
              {errors.field && <p style={{ fontSize: '20px', color: 'red' }}>{errors.field}</p>}

            </div>
            <div className="form-fields">
              <div>
                <label htmlFor="tenderOpeningDate">
                  معاد فتح المظاريف
                  <input
                    type="date"
                    id="tenderOpeningDate"
                    name="deadline"
                    min={minDate}
                    value={tenderadFormData.deadline}
                    onChange={handleChangeAd}
                    max={maxDate}
                  />
                </label>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {errors.deadline && <p style={{ fontSize: '20px', color: 'red' }}>{errors.deadline}</p>}
              </div>
            </div>
          </div>
          <div className="bidding_officials">
            <div className="gradient__text">
              <h1>مسوؤلي المناقصة</h1>
            </div>
            {officials.map((official, idx) => (
              <div key={idx} className="form-fields row">
                <div className="col-md-6">
                  <label htmlFor={`officialName_${idx}`}>الاسم
                    <input
                      type="text"
                      id={`officialName_${idx}`}
                      value={official.name}
                      onChange={(e) => handleOfficialChange(idx, 'name', e.target.value)}
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
                      value={official.position}
                      onChange={(e) => handleOfficialChange(idx, 'position', e.target.value)}
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
            <button
              type="button"
              className="button condition"
              onClick={handleAddOfficial}
            >
              إضافة مسؤول مناقصة
            </button>
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
                  <th style={{ width: '1px' }}>الصف</th>
                  <th className="col-2">عنوان المنتج</th>
                  <th className="col-1">وحدة الكمية</th>
                  <th className="col-1">الكمية</th>
                  <th className="col-">وصف المنتج</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, idx) => (
                  <tr key={idx}>
                    <td>{product.id}</td>
                    <td style={{ position: 'relative', paddingBottom: '20px' }}>
                      <textarea
                        type="text"
                        ref={textareaRef.current[0]}
                        onInput={() => handleInput(0)}
                        id={`title_${idx}`}
                        aria-label="title"
                        value={product.title}
                        onChange={(e) => {
                          handleProductChange(idx, 'title', e.target.value);
                          handleTitleChange(idx, e.target.value);
                        }}
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
                        ref={textareaRef.current[1]}
                        onInput={() => handleInput(1)}
                        type="text"
                        id={`unit_${idx}`}
                        value={product.unit}
                        aria-label="quantity_unit"
                        onChange={(e) => handleProductChange(idx, 'unit', e.target.value)}
                      />
                      {errors.products && errors.products[idx] && errors.products[idx].unit && (
                        <p style={{ fontSize: '12px', color: 'red', position: 'absolute', bottom: '0px' }}>
                          {errors.products[idx].unit}
                        </p>
                      )}
                    </td>
                    <td style={{ position: 'relative', paddingBottom: '20px' }}>
                      <textarea
                        ref={textareaRef.current[2]}
                        onInput={() => handleInput(2)}
                        id={`quantity_${idx}`}
                        value={product.quantity}
                        aria-label="quantity"
                        onChange={(e) => handleProductChange(idx, 'quantity', e.target.value)}
                        onKeyDown={(e) => {
                          // Allow: backspace, delete, tab, escape, enter
                          if (
                            e.key === 'Backspace' ||
                            e.key === 'Delete' ||
                            e.key === 'Tab' ||
                            e.key === 'Escape' ||
                            e.key === 'Enter' ||
                            (e.ctrlKey && (e.key === 'a' || e.key === 'c' || e.key === 'v' || e.key === 'x'))
                          ) {
                            return;
                          }
                          // Prevent: non-numeric keys
                          if (
                            (e.key < '0' || e.key > '9') &&
                            (e.key !== 'ArrowLeft' &&
                            e.key !== 'ArrowRight')
                          ) {
                            e.preventDefault();
                          }
                        }}
                      />
                      {errors.products && errors.products[idx] && errors.products[idx].quantity && (
                        <p style={{ fontSize: '12px', color: 'red', position: 'absolute', bottom: '0px' }}>
                          {errors.products[idx].quantity}
                        </p>
                      )}
                    </td>
                    <td style={{ position: 'relative', paddingBottom: '20px' }}>
                      <textarea
                        ref={textareaRef.current[3]}
                        onInput={() => handleInput(3)}
                        type="text"
                        id={`description_${idx}`}
                        value={descriptions[idx]}
                        aria-label="description"
                        onChange={(e) => handleDescriptionChange(idx, e.target.value)}
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
            <button
              type="button"
              className="button condition"
              onClick={handleAddProduct}
            >
              إضافة منتج جديد
            </button>
          </div>

          {/* <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '3px' }}>الصف</th>
                  <th className="col-3">عنوان المنتج</th>
                  <th className="col-10">وصف المنتج</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, idx) => (
                  <tr key={idx}>
                    <td>{product.id}</td>
                    <td>
                      <input
                        type="text"
                        value={product.title}
                        readOnly
                        aria-label="عنوان المنتج"
                      />
                    </td>
                    <td>
                      <label htmlFor={`description_${idx}`}>
                        وصف المنتج
                        <input
                          type="text"
                          id={`description_${idx}`}
                          value={descriptions[idx]}
                          onChange={(e) => handleDescriptionChange(idx, e.target.value)}
                        />
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              type="button"
              className="button condition"
              onClick={handleAddProduct}
            >
              إضافة منتج جديد
            </button>
          </div> */}
          {/* <hr data-v-7e013592 /> */}
          <div className="gradient__text m-3">
            <h1>الشروط العامة</h1>
          </div>

          <div className="condition-section">
            {conditions.map((condition, idx) => (
              <div key={idx} className="condition-field1">
                <input
                  type="text"
                  value={condition.value}
                  onChange={(e) => handleConditionChange(idx, e.target.value)}
                  placeholder={` الشرط رقم ${idx + 1}`}
                />
                {errors.public_conditions && errors.public_conditions[idx] && errors.public_conditions[idx].condition && <p style={{ fontSize: '20px', color: 'red' }}>{errors.public_conditions[idx].condition}</p>}
              </div>
            ))}
            <button
              type="button"
              className="button condition"
              onClick={handleAddCondition}
            >
              اضافة شرط
            </button>
          </div>

          <div className="gradient__text m-3">
            <h1>الشروط الخاصة</h1>
          </div>

          <div className="condition-section">
            {privateconditions.map((privateCondition, idx) => (
              <div key={idx} className="condition-field1">
                <input
                  type="text"
                  value={privateCondition.value}
                  onChange={(e) => handlePrivateConditionChange(idx, e.target.value)}
                  placeholder={` الشرط الخاص رقم ${idx + 1}`}
                />
                {errors.private_conditions && errors.private_conditions[idx] && errors.private_conditions[idx].condition && <p style={{ fontSize: '20px', color: 'red' }}>{errors.private_conditions[idx].condition}</p>}
              </div>
            ))}
            <button
              type="button"
              className="button condition"
              onClick={handleAddPrivateCondition}
            >
              اضافة شرط
            </button>
          </div>

          <div className="button-container">
            <button
              disabled={loading} // or another condition that sets the disabled state
              type="submit"
              className="button submit"
              onClick={() => setSubmitType('open')}
              onSubmit={handleSubmit}
            >
              {loading ? 'جاري نشر المناقصه......' : 'نشر'}
            </button>
            <button disabled={loading} type="submit" className="button" onClick={() => setSubmitType('draft')} onSubmit={handleSubmit}>
              حفظ كمسودة
            </button>
            <button disabled={loading} type="submit" className="button" onClick={() => setSubmitType('template')} onSubmit={handleSubmit}>
              حفظ كنموذج
            </button>
            <button disabled={loading} type="button" className="button cancel">
              الغاء
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default CreateTender;
