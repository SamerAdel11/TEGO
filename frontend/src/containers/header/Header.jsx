import React from 'react';
// import people from '../../assets/people.png';
import ai from '../../assets/Logo4.png';
import './header.css';

const Header = () => (
  <div className="gpt3__header section__padding" id="home">
    <div className="gpt3__header-content">
      <h1 className="gradient__text">TEGO</h1>
      <h1 className="gradient__text second-line">( منقصات الحكومة المصرية )</h1>
      <p>TEGO عبارة عن منصة على الإنترنت تحل محل إعلانات الصحف التقليدية. يؤدي ذلك إلى تسريع عملية المناقصة ويجعل مجال المناقصة في متناول الجميع. كما أنه يقوم بتحويل كتيب الشروط والأحكام إلى صيغة رقمية، مما يوفر رؤى تفصيلية لمقدمي العروض المحتملين، ويعزز الفهم، ويضمن عثور العميل على المورد المطابق تمامًا.</p>

      <div className="gpt3__header-content__input">
        <input type="email" placeholder="البريد الالكتروني" />
        <button type="button">لنبدأ</button>
      </div>
    </div>

    <div className="gpt3__header-image">
      <img src={ai} />
    </div>
  </div>
);

export default Header;
