import React, { useState, useContext, useRef, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import './AddResponse.css';
import AuthContext from '../../../context/Authcontext';

function AddResponse() {
  const { authTokens } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [products, setProducts] = useState(data && data.products);
  const textareaRefs = useRef([]);
  const [conditions, setConditions] = useState(data && data.public_conditions);
  const [privateconditions, setPrivateConditions] = useState(data && data.private_conditions);

  const navigate = useHistory();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tenderId = searchParams.get('tender_id');
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
    updatedPrivateConditions[idx].value = value;
    setPrivateConditions(updatedPrivateConditions);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const renameKeys = (product) => ({
      product_title: product.title,
      product_description: product.description,
      provided_quantity: product.quantity,
      productid: product.id,
      supplying_status: product.supplying_status,
    });
    const renameKeys2 = (prcondition) => ({
      condition: prcondition.id,
      offered_condition: prcondition.condition,
    });
    const renamedProducts = products.map(renameKeys);
    const renamedPrcondition = privateconditions.map(renameKeys2);
    try {
      const formData = {
        offer_products: renamedProducts,
        offer_conditions: renamedPrcondition,
        tender_id: tenderId,
        status: 'offered',
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
              <label htmlFor="tenderOpeningDate">معاد فتح المظاريف
                <input id="tenderOpeningDate" value={data && data.ad.deadline} readOnly="readonly" />
              </label>
            </div>
          </div>
          <div className="admin">
            <div className="gradient__text">
              <h1>الأعضاء</h1>
            </div>
            <div>
              {data && data.admins.map((admin, adminIndex) => (
                <tr key={adminIndex}>
                  <td>{admin.name}</td>
                  <td>{admin.job_title}</td>
                </tr>
              ))}
            </div>
          </div>
          <hr data-v-7e013592 />
          <div className="create_new_tender">
            <div className="gradient__text">
              <h1>عمل مناقصة جديدة</h1>
            </div>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '1px' }}>رقم المنتج</th>
                  <th className="col-2">عنوان المنتج</th>
                  <th className="col-1">وحدة الكمية</th>
                  <th className="col-1">الكمية</th>
                  <th className="col-">وصف المنتج</th>
                  <th className="col-2">حاله التوريد</th>
                </tr>
              </thead>
              <tbody>
                { products && products.map((product, idx) => (
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
                        value={product.quantity}
                        onChange={(e) => handleProductChange(idx, 'quantity', e.target.value)}
                        onInput={(e) => handleTextareaInput(e, idx)}
                        aria-label={`Quantity for Product ${product.id}`}
                      />
                    </td>
                    <td>
                      <textarea
                        ref={(el) => { textareaRefs.current[idx] = el; }}
                        id={`description${idx}`}
                        value={product.description}
                        onChange={(e) => handleProductChange(idx, 'description', e.target.value)}
                        onInput={(e) => handleTextareaInput(e, idx)}
                        aria-label={`Description for Product ${product.id}`}
                      />
                    </td>
                    <td>
                      <select value={product.supplying_status} onChange={(e) => handleProductChange(idx, 'supplying_status', e.target.value)}>
                        <option value="">اختر حاله التوريد</option>
                        <option value="متوفر">متوفر</option>
                        <option value="نأسف">نأسف</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="form-fields col-md-3" style={{ marginTop: '20px', marginBottom: '10px' }}>
            <label htmlFor="create_tender">السعر المعروض للمناقصة بالكامل
              <input style={{ marginTop: '20px', marginBottom: '10px' }} type="number" id="offeredprice" />
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
            { privateconditions && privateconditions.map((privateCondition, idx) => (
              <div key={idx} className="private-condition-field">
                <span className="condition-index">{idx + 1}.</span>
                <input
                  type="text"
                  defaultValue={`${privateCondition.condition}`}
                  onChange={(e) => handlePrivateConditionChange(idx, e.target.value)}
                  placeholder={` الشرط الخاص رقم ${idx + 1}`}
                  className="private-condition-input"
                />
              </div>
            ))}
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

export default AddResponse;
