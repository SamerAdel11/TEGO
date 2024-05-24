import React, { useState, useContext, useRef, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import AuthContext from '../../../../context/Authcontext';
// import './AddResponse.css';

function Response() {
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
  const navigate = useHistory();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  // const [totalPrice, setTotalPrice] = useState(0);
  const tenderId = searchParams.get('tender_id');
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
    getResponse();
    fetchTenders();
  }, [authTokens]);
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
  const handleClick = () => {
    navigate.push('/open_tenders');
  };
  const handlePrivateConditionChange = (idx, value) => {
    const updatedPrivateConditions = [...privateconditions];
    updatedPrivateConditions[idx].condition = value;
    setPrivateConditions(updatedPrivateConditions);
    console.log(updatedPrivateConditions);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const renameKeys = (product) => ({
      product_title: product.title,
      product_description: product.description,
      provided_quantity: product.quantity,
      productid: product.id,
      supplying_status: product.supplying_status,
      price: product.price,
    });
    const renameKeys2 = (prcondition) => ({
      condition: prcondition.id,
      offered_condition: prcondition.condition,
    });
    const renamepreviouswork = (work) => ({
      title: work.title,
      description: work.description,
    });
    const renamedProducts = products.map(renameKeys);
    const renamedPrcondition = privateconditions.map(renameKeys2);
    const renamedWork = previousWork.map(renamepreviouswork);
    try {
      const formData = {
        offer_products: renamedProducts,
        offer_conditions: renamedPrcondition,
        tender_id: tenderId,
        status: 'offered',
        previous_work: renamedWork,
        offered_price: document.getElementById('offeredprice').value,
      };

      const response2 = await fetch('http://localhost:8000/add_response/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authTokens.access}`,
        },
        body: JSON.stringify(formData),
      });
      if (response2.ok) {
        console.log(formData);
        console.log('response2');
        console.log(response2);
        navigate.push('/open_tenders');
      } else {
        console.log('ERROR', response2.json());
      }
    } catch (error) {
      console.error('Error:', error);
    }
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
    } else {
      console.error('Error in submitting the data');
    }
  };
  if (!data || !offer) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div className="container_create_tender">
        <form onSubmit={handleSubmit}>
          {offer.status === 'awarded' && (
            <div className="buttons_awating">
              <button
                type="submit"
                className="button_awating"
                onClick={(e) => {
                  e.preventDefault();
                  confirmNotification('confirmed');
                }}
              >
                موافق
              </button>
              <button
                type="button"
                style={{ background: 'red' }}
                className="button_awating"
                onClick={(e) => {
                  e.preventDefault();
                  confirmNotification('rejected');
                }}
              >
                رفض
              </button>
            </div>
          )}
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
                <textarea type="text" id="tenderSubject" defaultValue={data && data.ad.topic} readOnly="readonly" />
              </label>
            </div>
            <div className="form-fields">
              <label htmlFor="tenderSubject">مجال المناقصة
                <textarea type="text" id="tenderField" value={data && data.ad.field} readOnly="readonly" />
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
                  defaultValue={`${privateCondition.offered_condition}`}
                  onChange={(e) => handlePrivateConditionChange(idx, e.target.value)}
                  placeholder={` الشرط الخاص رقم ${idx + 1}`}
                  className="private-condition-input"
                />
              </div>
            ))}
          </div>
          <div>
            {offer.previous_work ? (
              <div className="gradient__text m-3">
                <h1>الأعمال السابقة</h1>
              </div>
            ) : (
              <div className="gradient__text m-3">
                <h1>لا يوجدالأعمال السابقة </h1>
              </div>
            ) }
            {offer.previous_work.map((work, index) => (
              <div key={index}>
                <h3>المشروع رقم {index + 1}</h3>
                <label htmlFor="prevtenderTitle">عنوان المناقصة
                  <input type="text" id="prevtenderTitle" value={work.title} onChange={(e) => handlePreviousWorkChange(index, 'title', e.target.value)} />
                </label>
                <label htmlFor="prevtenderSubject">موضوع المناقصة
                  <textarea
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

          <div className="button-container">
            <button type="submit" className="button" onSubmit={handleSubmit}>
              إرسال العرض
            </button>
            <button type="button" className="button cancel" onClick={handleClick}>
              الغاء
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Response;
