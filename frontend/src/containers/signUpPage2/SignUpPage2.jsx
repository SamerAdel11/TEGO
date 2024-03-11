import React, { useState } from 'react';
// import { Navbar } from '../../components';
import './signUpPage2.css';
// import axios from 'axios';

import { Link } from 'react-router-dom'; // Import Link
import '../../components/navbar/navbar.css';
import logo from '../../assets/Logo4.png';

const SignUpPage2 = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    UserName: '',
    // address: '',
    First_Name: '',
    // registrationAuthority: '',
    Second_Name: '',
    Password: '',
    Password2: '',
    email: '',
    // companyType: '',
    // capital: '',
    // The_owner_id: '',
    // owner_name: '',
    // Position_of_owner: Array(3).fill(''),
    // Owner_address: '',
    // Company_branches_address: '',
    // Company_branches_governorate: '',
    Main_activity: '',
    Sub_activity: '',
    address: '',
    registrationAuthority: '',
    fax: '',
    mobile: '',
    phone: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const [repeatActivityRows, setRepeatActivityRows] = useState(1); // State for repeated activity rows
  const handleAddActivityRow = () => {
    setRepeatActivityRows((prevRepeatRows) => prevRepeatRows + 1);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const postData = {
        company_fields: [...Array(repeatActivityRows)].map((_, index) => ({
          primary_field: formData[`Main_activity_${index}`],
          secondary_field: formData[`Sub_activity_${index}`],
        })),
        user: {
          first_name: formData.First_Name,
          last_name: formData.Second_Name,
          email: formData.email,
          password: formData.Password,
          password2: formData.Password2,
        },
        is_supplier: false,
        name: formData.companyName,
        location: formData.address,
        fax_number: formData.fax,
        mobile: formData.mobile,
        landline: formData.phone,
        city: formData.registrationAuthority,
        company_type: 'buyer',
      };
      // Make POST request
      const response = await fetch('http://localhost:8000/companies/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      if (!response.ok) {
        console.log(JSON.stringify(postData));
        console.error(response.json());
      } else {
        console.log(response.json());
      }
      // Optionally, you can handle the response here
      console.log('Form submitted successfully');
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle errors, e.g., display error messages to the user
    }
  };
  return (
    <>
      <div className="gpt3__navbar">
        <div className="gpt3__navbar-links">
          <div className="gpt3__navbar-links_logo">
            <img src={logo} alt="logo" />
          </div>
          <div className="gpt3__navbar-links_container">
            <p><Link to="/">الرئيسية</Link></p>
          </div>
        </div>
        <div className="gpt3__navbar-sign">
          <p>تسجيل الدخول</p>
          {/* Use Link here */}
          <Link to="/sign"><button type="button">انشاء حساب جديد</button></Link>
        </div>
      </div>
      <div className="suplier-signUp section__padding">
        <form onSubmit={handleSubmit}>
          <div className="gradient__text">
            <h1>بيانات المشتري</h1>
          </div>
          <div className="form-group">
            <label htmlFor="UserName">اسم المستخدم
              <input type="text" name="UserName" id="UserName" value={formData.UserName} onChange={handleChange} />
            </label>
          </div>
          <div className="row">
            <div className="form-group col-md-6">
              <label htmlFor="First_Name">الاسم الاول
                <input type="text" name="First_Name" id="First_Name" value={formData.First_Name} onChange={handleChange} />
              </label>
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="Second_Name">الاسم الثاني
                <input type="text" name="Second_Name" id="Second_Name" value={formData.Second_Name} onChange={handleChange} />
              </label>
            </div>
          </div>
          <div className="row">
            <div className="form-group col-md-6">
              <label htmlFor="Password">كلمة السر
                <input type="text" name="Password" id="Password" value={formData.Password} onChange={handleChange} />
              </label>
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="Password2">تاكيد كلمة السر
                <input type="text" name="Password2" id="Password2" value={formData.Password2} onChange={handleChange} />
              </label>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="email">البريد الالكتروني
              <input type="text" name="email" id="email" value={formData.email} onChange={handleChange} />
            </label>
          </div>
          <hr data-v-7e013592 />
          <h2>انشطة الشركة</h2>
          {[...Array(repeatActivityRows)].map((_, index) => (
            <div key={index} className="row">
              <div className="form-group col-md-6">
                <label htmlFor={`Main_activity_${index}`}>نشاط رئيسي
                  <input type="text" name={`Main_activity_${index}`} id={`Main_activity_${index}`} value={formData[`Main_activity_${index}`]} onChange={handleChange} />
                </label>
              </div>
              <div className="form-group col-md-6">
                <label htmlFor={`Sub_activity_${index}`}>نشاط فرعي
                  <input type="text" name={`Sub_activity_${index}`} id={`Sub_activity_${index}`} value={formData[`Sub_activity_${index}`]} onChange={handleChange} />
                </label>
              </div>
            </div>
          ))}
          <button type="button" className="Add_button" onClick={handleAddActivityRow}>
            <i className="fa fa-plus" /> اضافة نشاط آخر
          </button>
          <hr data-v-7e013592 />
          <div className="gradient__text">
            <h1 className="account_h1">معلومات الاتصال</h1>
          </div>
          <div className="form-group">
            <label htmlFor="address">اسم الشركه
              <input type="text" name="companyName" id="companyName" value={formData.companyName} onChange={handleChange} />
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="address">العنوان
              <input type="text" name="address" id="address" value={formData.address} onChange={handleChange} />
            </label>
          </div>
          <div className="form-group ">
            <label htmlFor="registrationAuthority">المحافظة
              <select name="registrationAuthority" id="registrationAuthority" value={formData.registrationAuthority} onChange={handleChange}>
                <option value="">اختر الجهة</option>
                <option value="القاهرة">القاهرة</option>
                <option value="الإسكندرية">الإسكندرية</option>
                <option value="الجيزة">الجيزة</option>
                <option value="القليوبية">القليوبية</option>
                <option value="الدقهلية">الدقهلية</option>
                <option value="الشرقية">الشرقية</option>
                <option value="الغربية">الغربية</option>
                <option value="الإسماعيلية">الإسماعيلية</option>
                <option value="البحيرة">البحيرة</option>
                <option value="كفر الشيخ">كفر الشيخ</option>
                <option value="دمياط">دمياط</option>
                <option value="بورسعيد">بورسعيد</option>
                <option value="السويس">السويس</option>
                <option value="شمال سيناء">شمال سيناء</option>
                <option value="جنوب سيناء">جنوب سيناء</option>
                <option value="الفيوم">الفيوم</option>
                <option value="بني سويف">بني سويف</option>
                <option value="المنوفية">المنوفية</option>
                <option value="أسيوط">أسيوط</option>
                <option value="الوادي الجديد">الوادي الجديد</option>
                <option value="سوهاج">سوهاج</option>
                <option value="قنا">قنا</option>
                <option value="الأقصر">الأقصر</option>
                <option value="أسوان">أسوان</option>
                <option value="البحر الأحمر">البحر الأحمر</option>
              </select>
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="fax">فاكس
              <input type="text" name="fax" id="fax" value={formData.fax} onChange={handleChange} />
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="mobile">موبيل
              <input type="text" name="mobile" id="mobile" value={formData.mobile} onChange={handleChange} />
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="phone">تليفون
              <input type="text" name="phone" id="phone" value={formData.phone} onChange={handleChange} />
            </label>
          </div>
          <button type="submit" className="submit_button" onClick={handleSubmit}>Submit</button>
        </form>
      </div>
    </>
  );
};

export default SignUpPage2;
