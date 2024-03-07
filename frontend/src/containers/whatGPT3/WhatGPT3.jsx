import React from 'react';
import Feature from '../../components/feature/Feature';
import './whatGPT3.css';

const WhatGPT3 = () => (
  <div className="gpt3__whatgpt3 section__margin" id="wgpt3">
    <div className="gpt3__whatgpt3-feature">
      <Feature title="ما هو TEGO" text="TEGO عبارة عن منصة على الإنترنت تحل محل إعلانات الصحف التقليدية. يؤدي ذلك إلى تسريع عملية المناقصة ويجعل مجال المناقصة في متناول الجميع." />
    </div>
    <div className="gpt3__whatgpt3-heading">
      <h1 className="gradient__text">الاحتمالات هي أبعد من خيالك</h1>
      {/* <p>Explore the Library</p> */}
    </div>
    <div className="gpt3__whatgpt3-container">
      <Feature title="الرقمنة" text="تقوم TEGO بتحويل كتيب الشروط والأحكام إلى صيغة رقمية، مما يوفر رؤى تفصيلية لمقدمي العروض المحتملين، ويعزز الفهم، ويضمن عثور العميل على المورد المطابق تمامًا." />
      <Feature title="التفاعلات البشرية" text="TEGO يقلل من التفاعلات البشرية ومخاطر الفساد. ويهدف إلى تحقيق منافسة أكثر عدالة للكيانات الصغيرة من خلال التعامل مع مقدم الخدمة والمشترين بشكل مجهول دون الحاجة إلى أي تحديد هوية." />
      <Feature title="زيادة العدالة" text="تستكشف TEGO التكامل الحكومي، مع التركيز على دورها في تسهيل الضرائب ومنع التهرب من خلال السجلات التفصيلية. وبعيدًا عن الشؤون المالية، تشير TEGO إلى التحول إلى العمليات الآلية والشفافة. ستستفيد المنظمات من خلال تحقيق المزيد من العدالة وإمكانية الوصول والنزاهة في مجال المشتريات." />
    </div>
  </div>
);

export default WhatGPT3;
