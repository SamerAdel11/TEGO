import React from 'react';
import possibilityImage from '../../assets/possibility.png';
import './possibility.css';

const Possibility = () => (
  <div className="gpt3__possibility section__padding" id="possibility">
    <div className="gpt3__possibility-image">
      <img src={possibilityImage} alt="possibility" />
    </div>
    <div className="gpt3__possibility-content">
      <h1 className="gradient__text">العمل المستقبلي</h1>
      <h4>خلال عملية تطوير TEGo، سيتم الأخذ في الاعتبار بعض الميزات الإضافية التي يمكن إضافتها. في هذا القسم سيتم تقديم بعض الميزات المستقبلية التي يمكن إضافتها إلى TEGo.</h4>
      <div className="gpt3__possibility-content-list">
        <ul>
          <li>الدردشة الآلية</li>
          <li>تخزين البيانات</li>
          <li>المخزون الافتراضي</li>
          <li>هرم الموظفين</li>
        </ul>
        <ul>
          <li>جعل تطبيقنا متاحًا عالميًا</li>
          <li>تطبيق جوال صغير</li>
          <li>نظام تحذير</li>
          <li>التكامل في نظام الحكومة</li>
        </ul>
      </div>
    </div>
  </div>
);

export default Possibility;
