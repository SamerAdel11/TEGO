/* eslint-disable jsx-a11y/control-has-associated-label */
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

  useEffect(() => {
    // Get the current date
    const today = new Date();
    // Format the date as yyyy-mm-dd
    const formattedMinDate = today.toISOString().split('T')[0];
    console.log(formattedMinDate);
    const nextYear = new Date(today);
    nextYear.setFullYear(today.getFullYear() + 1);
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

  const [products, setProducts] = useState(tender && tender.products);
  // const [descriptions, setDescriptions] = useState(['']);
  // const [index, setIndex] = useState(1);
  const [conditions, setConditions] = useState(['']);
  const [privateconditions, setPrivateConditions] = useState(['']);
  // const [submitType, setSubmitType] = useState('');
  const [loading, setLoading] = useState(false);

  const textareaRefs = useRef([]);
  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const response = await fetch(`http://localhost:8000/tender/${id}`, {
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

  const SetTenderToOpen = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:8000/tender/${id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authTokens.access}`,
          },
          body: JSON.stringify({
            status: 'open',
          }),
        },
      );

      if (response.ok) {
        navigate.push('/mytender');
      }
    } catch (errr) {
      console.error('Error sending response:', errr);
    }
    setLoading(true);
  };
  const SetTenderToDraft = async () => {
    const response = await fetch(
      `http://localhost:8000/tender/${id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authTokens.access}`,
        },
        body: JSON.stringify({
          status: 'draft',
        }),
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
        <form>
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

            </div>
            <div className="form-fields">
              <label htmlFor="tenderSubject">موضوع المناقصة
                <textarea style={{ paddingRight: '17px' }} type="text" name="topic" id="tenderSubject" value={tender.ad.topic} />
              </label>
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
            </div>
            <div className="form-fields">
              <label htmlFor="tenderSubject">مجال المناقصة
                <input name="field" value={tender.ad.field} />
              </label>

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
                </div>
                <div className="col-md-6">
                  <label htmlFor={`officialPosition_${idx}`}>الوظيفة
                    <input
                      type="text"
                      id={`officialPosition_${idx}`}
                      value={official.job_title}
                    />
                  </label>
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
                    </td>
                    <td style={{ position: 'relative', paddingBottom: '20px' }}>
                      <textarea
                        style={{ alignItems: 'center', justifyContent: 'center' }}
                        ref={(el) => { textareaRefs.current[idx] = el; }}
                        id="unit"
                        value={product.quantity_unit}

                      />
                    </td>
                    <td style={{ position: 'relative', paddingBottom: '20px' }}>
                      <textarea
                        ref={(el) => { textareaRefs.current[idx] = el; }}
                        id="quantity"
                        value={product.quantity}
                      />
                    </td>
                    <td style={{ position: 'relative', paddingBottom: '20px' }}>
                      <textarea
                        ref={(el) => { textareaRefs.current[idx] = el; }}
                        id={`description${idx}`}
                        value={product.description}
                      />
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
              </div>
            ))}
          </div>

          <div className="button-container">
            <button
              style={{ marginRight: '150px', marginLeft: '150px' }}
              disabled={loading}
              type="button"
              className="buton_resonpose submit"
              onClick={SetTenderToOpen}
            >
              { !loading ? 'إعاده نشر المناقصة' : 'جاري إعاده نشر المناقصة ......'}
            </button>
            <button
              style={{ marginLeft: '150px' }}
              className="buton_resonpose"
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
