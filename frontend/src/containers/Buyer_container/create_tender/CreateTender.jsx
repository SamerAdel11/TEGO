import React, { useState, useContext, useRef } from 'react';
import './createtender.css';
import { useHistory } from 'react-router-dom';
import AuthContext from '../../../context/Authcontext';

function CreateTender() {
  const navigate = useHistory();
  const { authTokens } = useContext(AuthContext);
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

  const handleSelectChange = (event) => {
    setSelectedTender(event.target.value);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        ad: {
          title: e.target.querySelector('#tenderTitle').value,
          topic: e.target.querySelector('#tenderSubject').value,
          deadline: e.target.querySelector('#tenderOpeningDate').value,
          field: selectedTender,
        },
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
        initial_price: e.target.querySelector('#create_tender').value,
        status: 'Open',
      };
      const response = await fetch('http://localhost:8000/create_tender/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authTokens.access}`,
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        console.log('Data sent successfully');
        navigate.push('/mytender');
        // You can reset form state or take other actions if needed
      } else {
        console.error('Failed to send data to server', response.json());
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
                <input type="text" id="tenderTitle" />
              </label>
            </div>
            <div className="form-fields">
              <label htmlFor="tenderSubject">موضوع المناقصة
                <textarea type="text" id="tenderSubject" />
              </label>
            </div>
            <div className="form-fields">
              <label htmlFor="tenderSubject">مجال المناقصة
                <select value={selectedTender} onChange={handleSelectChange}>
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
            </div>
            <div className="form-fields">
              <label htmlFor="tenderOpeningDate">معاد فتح المظاريف
                <input type="date" id="tenderOpeningDate" />
              </label>
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
                </div>
              </div>
            ))}
            <button
              type="button"
              className="button condition"
              onClick={handleAddOfficial}
            >
              إضافة مسؤول مناقصة جديد
            </button>
          </div>
          <div className="create_new_tender">
            <div className="gradient__text">
              <h1>عمل مناقصة جديدة</h1>
            </div>
            <div className="form-fields">
              <label htmlFor="create_tender">التسعيرة الداخية
                <input type="text" id="create_tender" />
              </label>
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
                    <td>
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
                      />
                    </td>
                    <td>
                      <textarea
                        ref={textareaRef.current[1]}
                        onInput={() => handleInput(1)}
                        type="text"
                        id={`unit_${idx}`}
                        value={product.unit}
                        aria-label="quantity_unit"
                        onChange={(e) => handleProductChange(idx, 'unit', e.target.value)}
                      />
                    </td>
                    <td>
                      <textarea
                        type="text"
                        ref={textareaRef.current[2]}
                        onInput={() => handleInput(2)}
                        id={`quantity_${idx}`}
                        value={product.quantity}
                        aria-label="quantity"
                        onChange={(e) => handleProductChange(idx, 'quantity', e.target.value)}
                      />
                    </td>
                    <td>
                      <textarea
                        ref={textareaRef.current[3]}
                        onInput={() => handleInput(3)}
                        type="text"
                        id={`description_${idx}`}
                        value={descriptions[idx]}
                        aria-label="description"
                        onChange={(e) => handleDescriptionChange(idx, e.target.value)}
                      />
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
          <hr data-v-7e013592 />
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
            <button type="button" className="button">
              حفظ كمسودة
            </button>
            <button type="button" className="button">
              حفظ كقالب
            </button>
            <button type="submit" className="button" onSubmit={handleSubmit}>
              نشر
            </button>
            <button type="button" className="button cancel">
              الغاء
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default CreateTender;
