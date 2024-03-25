import React, { useState } from 'react';
import './createtender.css';

function CreateTender() {
  const [products, setProducts] = useState([
    { id: 1, title: '', unit: '', quantity: '' },
  ]);
  const [descriptions, setDescriptions] = useState(['']);
  const [index, setIndex] = useState(1);
  const [conditions, setConditions] = useState([{ id: 1, value: '' }]);

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

  const handleConditionChange = (idx, value) => {
    const updatedConditions = [...conditions];
    updatedConditions[idx].value = value;
    setConditions(updatedConditions);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create an array of promises for each product request
      const productRequests = products.map(async (product) => {
        const response = await fetch('http://your-django-server-url.com/api/endpoint', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ product, descriptions, conditions }),
        });
        if (response.ok) {
          console.log('Data sent successfully for product:', product.id);
          // You can reset form state or take other actions if needed
        } else {
          console.error('Failed to send data to server for product:', product.id);
        }
      });
      // Wait for all product requests to complete
      await Promise.all(productRequests);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
    <>
      <div className="container_create_tender">
        <form onSubmit={handleSubmit}>
          <div className="gradient__text">
            <h1>عمل مناقصة جديدة</h1>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '3px' }}>الصف</th>
                  <th className="col-4">عنوان المنتج</th>
                  <th className="col-4">وحدة الكمية</th>
                  <th className="col-4">الكمية</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, idx) => (
                  <tr key={idx}>
                    <td>{product.id}</td>
                    <td>
                      <label htmlFor={`title_${idx}`}>
                        عنوان المنتج
                        <input
                          type="text"
                          id={`title_${idx}`}
                          value={product.title}
                          onChange={(e) => {
                            handleProductChange(idx, 'title', e.target.value);
                            handleTitleChange(idx, e.target.value);
                          }}
                        />
                      </label>
                    </td>
                    <td>
                      <label htmlFor={`unit_${idx}`}>
                        وحدة الكمية
                        <input
                          type="text"
                          id={`unit_${idx}`}
                          value={product.unit}
                          onChange={(e) => handleProductChange(idx, 'unit', e.target.value)}
                        />
                      </label>
                    </td>
                    <td>
                      <label htmlFor={`quantity_${idx}`}>
                        الكمية
                        <input
                          type="text"
                          id={`quantity_${idx}`}
                          value={product.quantity}
                          onChange={(e) => handleProductChange(idx, 'quantity', e.target.value)}
                        />
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="table-container">
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
          </div>
          <hr data-v-7e013592 />
          <div className="gradient__text m-3">
            <h1>الشروط الرئيسية</h1>
          </div>

          {/* Conditions section */}
          <div className="condition-section">
            {conditions.map((condition, idx) => (
              <div key={idx} className="condition-field">
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

          <div className="button-container">
            <button type="button" className="button">
              حفظ كمسودة
            </button>
            <button type="button" className="button">
              حفظ كقالب
            </button>
            <button type="submit" className="button">
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
