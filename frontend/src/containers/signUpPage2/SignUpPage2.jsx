import React, { useState, useContext } from 'react';
// import { Navbar } from '../../components';
import './signUpPage2.css';
// import axios from 'axios';

import { Link } from 'react-router-dom'; // Import Link
import AuthContext from '../../context/Authcontext';
import '../../components/navbar/navbar.css';
import logo from '../../assets/Logo4.png';

const SignUpPage2 = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    companyName: '',
    UserName: '',
    // address: '',
    First_Name: '',
    // registrationAuthority: '',
    Second_Name: '',
    passWord: '',
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

  const [repeatBranchRows, setRepeatBranchRows] = useState(1);
  const handleAddBranchRow = () => {
    if (repeatBranchRows < 3) {
      setRepeatBranchRows((prevRepeatRows) => prevRepeatRows + 1);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const postData = {
        user: {
          first_name: formData.First_Name,
          last_name: formData.Second_Name,
          email: formData.email,
          password: formData.passWord,
          password2: formData.Password2,
        },
        owners: [...Array(repeatBranchRows)].map((_, index) => ({
          name: formData[`owner_name_${index}`],
          owner_id: formData[`The_owner_id_${index}`],
          onwer_position: formData[`Position_of_owner_${index}`],
          address: formData[`Owner_address_${index}`],
        })),
        name: formData.companyName,
        location: formData.address,
        fax_number: formData.fax,
        mobile: formData.mobile,
        landline: formData.phone,
        city: formData.registrationAuthority,
        company_type_tego: 'buyer',
        company_field: formData.Main_activity,

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
        await login(formData);
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
          <Link to="/signin">
            <p type="btn">تسجيل الدخول</p>
          </Link>
          {/* Use Link here */}
          <Link to="/sign"><button type="button">انشاء حساب جديد</button></Link>
        </div>
      </div>
      <div className="suplier-signUp section__padding">
        <form onSubmit={handleSubmit}>
          <div className="gradient__text">
            <h1>بيانات حساب المُعلِن</h1>
          </div>
          {/* <div className="row">
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
          </div> */}
          <div className="form-group">
            <label htmlFor="email">البريد الالكتروني
              <input type="text" name="email" id="email" value={formData.email} onChange={handleChange} />
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="passWord">كلمة السر
              <input type="password" name="passWord" id="passWord" value={formData.passWord} onChange={handleChange} />
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="Password2">تاكيد كلمة السر
              <input type="password" name="Password2" id="Password2" value={formData.Password2} onChange={handleChange} />
            </label>
          </div>
          <hr data-v-7e013592 />
          <div className="gradient__text">
            <h1 className="account_h1">بيانات الشركة</h1>
          </div>
          <div className="form-group">
            <label htmlFor="address">اسم الشركه
              <input type="text" name="companyName" id="companyName" value={formData.companyName} onChange={handleChange} />
            </label>
          </div>
          <div className="form-group ">
            <label htmlFor="Main_activity">مجال الشركة
              <input type="text" name="Main_activity" id="Main_activity" value={formData.Main_activity} onChange={handleChange} />
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
            <label htmlFor="mobile">موبايل
              <input type="text" name="mobile" id="mobile" value={formData.mobile} onChange={handleChange} />
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="phone">تليفون ارضي
              <input type="text" name="phone" id="phone" value={formData.phone} onChange={handleChange} />
            </label>
          </div>
          <hr data-v-7e013592 />
          <h2>ملاك الشركة المسئولين بالتضامن/ أعضاء مجلس الإدارة / المندوبين بحد أقصي(3)مندوب</h2>
          <div>
            {[...Array(repeatBranchRows)].map((_, index) => (
              <div>
                {index === 0 && <h2>المالك الأول</h2>}
                {index === 1 && <h2>المالك الثاني</h2>}
                {index === 2 && <h2>المالك الثالث</h2>}

                <div key={index} className="row">
                  <div className="form-group col-md-6">
                    <label htmlFor={`owner_name_${index}`}>الاسم
                      <input type="text" name={`owner_name_${index}`} id={`owner_name_${index}`} value={formData[`owner_name_${index}`]} onChange={(e) => handleChange(e, index)} />
                    </label>
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor={`Position_of_owner_${index}`}>المنصب
                      <select name={`Position_of_owner_${index}`} id={`Position_of_owner_${index}`} value={formData[`Position_of_owner_${index}`]} onChange={(e) => handleChange(e, index)}>
                        <option value="">اختر المنصب</option>
                        <option value="مالك">مالك</option>
                        <option value="رئيس مجلس ادارة">رئيس مجلس ادارة</option>
                        <option value="عضو مجلس ادارة">عضو مجلس ادارة</option>
                        <option value="مدير">مدير</option>
                        <option value="شريك">شريك</option>
                        <option value="زوج / زوجة المالك">زوج / زوجة المالك</option>
                        <option value="زوج / زوجة رئيس مجلس الادارة">زوج / زوجة رئيس مجلس الادارة</option>
                        <option value="مندوب">مندوب</option>
                      </select>
                    </label>
                  </div>
                  <div className="form-group col-md-12">
                    <label htmlFor={`The_owner_id_${index}`}>الرقم القومي
                      <input type="text" name={`The_owner_id_${index}`} id={`The_owner_id_${index}`} value={formData[`The_owner_id_${index}`]} onChange={(e) => handleChange(e, index)} />
                    </label>
                  </div>
                  <div className="form-group col-md-12">
                    <label htmlFor={`Owner_address_${index}`}>العنوان
                      <input type="text" name={`Owner_address_${index}`} id={`Owner_address_${index}`} value={formData[`Owner_address_${index}`]} onChange={(e) => handleChange(e, index)} />
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button data-v-7e013592="" type="button" className="Add_button" onClick={handleAddBranchRow}>
            <i data-v-7e013592="" className="fa fa-plus" />اضافة مالك اخر
          </button>
          <button type="submit" className="submit_button" onClick={handleSubmit}>Submit</button>
        </form>
      </div>
    </>
  );
};

export default SignUpPage2;
