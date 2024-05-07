import React, { useState, useRef, useEffect } from 'react';

const YourComponent = () => {
  const defaultProducts = [
    { id: 1, title: 'Default Title Default Title2 Default Title3 Default Title5 Default Title6', unit: 'Default Unit', quantity: 'Default Quantity', description: 'Default Description' },
    { id: 1, title: 'Default Title', unit: 'Default Unit', quantity: 'Default Quantity', description: 'Default Description' },
    { id: 1, title: 'Default Title', unit: 'Default Unit', quantity: 'Default Quantity 2 Default Quantity 3 Default Quantity4 Default Quantity5 Default Quantity6 Default Quantity87', description: 'Default Description' },
    { id: 1, title: 'Default Title', unit: 'Default Unit', quantity: 'Default Quantity', description: 'Default Description' },
  ];

  const [products, setProducts] = useState(defaultProducts);
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

  const handleProductChange = (idx, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[idx][field] = value;
    setProducts(updatedProducts);
  };

  // Calculate initial heights for textareas on component mount
  useEffect(() => {
    textareaRefs.current.forEach((textarea) => {
      if (textarea) {
        const temp = textarea;
        temp.style.height = `${textarea.scrollHeight}px`;
      }
    });
  }, [textareaRefs]);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Unit</th>
            <th>Quantity</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, idx) => (
            <tr key={idx}>
              <td>{product.id}</td>
              <td>
                <textarea
                  ref={(el) => { textareaRefs.current[idx] = el; }}
                  name="title"
                  value={product.title}
                  onChange={(e) => handleProductChange(idx, 'title', e.target.value)}
                  onInput={(e) => handleTextareaInput(e, idx)}
                  aria-label={`Title for Product ${product.id}`}
                />
              </td>
              <td>
                <textarea
                  ref={(el) => { textareaRefs.current[idx] = el; }}
                  name="unit"
                  value={product.unit}
                  onChange={(e) => handleProductChange(idx, 'unit', e.target.value)}
                  onInput={(e) => handleTextareaInput(e, idx)}
                  aria-label={`Unit for Product ${product.id}`}
                />
              </td>
              <td>
                <textarea
                  ref={(el) => { textareaRefs.current[idx] = el; }}
                  name="quantity"
                  value={product.quantity}
                  onChange={(e) => handleProductChange(idx, 'quantity', e.target.value)}
                  onInput={(e) => handleTextareaInput(e, idx)}
                  aria-label={`Quantity for Product ${product.id}`}
                />
              </td>
              <td>
                <textarea
                  ref={(el) => { textareaRefs.current[idx] = el; }}
                  name="description"
                  value={product.description}
                  onChange={(e) => handleProductChange(idx, 'description', e.target.value)}
                  onInput={(e) => handleTextareaInput(e, idx)}
                  aria-label={`Description for Product ${product.id}`}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default YourComponent;
