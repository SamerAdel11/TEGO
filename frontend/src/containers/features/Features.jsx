import React from 'react';
import Feature from '../../components/feature/Feature';
import './features.css';

const featuresData = [
  {
    title: 'النزاهة ضد الفساد',
    text: 'توجيهات أخلاقية ترشدنا، مكافحة غسيل الأموال، الرشوة، الحفاظ على النزاهة في كل عملية، ضمان أفق أعمال خالٍ من الفساد.',
  },
  {
    title: 'الخدمات المتكاملة',
    text: 'معالجة غياب خدمات النقل في المنصات الحالية من خلال توفير حلاً شاملاً.',
  },
  {
    title: 'التنقل الذكي مع فلاتر البحث',
    text: 'أدوات بحث متقدمة في مكانها، تسهيل إمكانية الوصول إلى المناقصات بدقة، توفير الوقت لجميع الأطراف المعنية، تنقل بسيط للتعاون الفعال.',
  },
  {
    title: 'تقييم الموردين',
    text: 'تمكين المشترين من نظام تقييم شامل للموردين لاتخاذ القرارات المستنيرة.',
  },
  {
    title: 'نظام التوصيات',
    text: 'استخدام الذكاء الاصطناعي لتبسيط عملية اتخاذ القرار عن طريق تقديم توصيات شخصية لأفضل عروض المناقصات.',
  },
  {
    title: 'اشتراك مرن',
    text: 'تقديم نموذج سهل الاستخدام مع حرية استخدام الميزات دون الحاجة إلى اشتراكات إلزامية.',
  },
];

const Features = () => (
  <div className="gpt3__features section__padding" id="features">
    <div className="gpt3__features-heading">
      <h1 className="gradient__text">لماذا TEGO</h1>
      <p>المستقبل هو الآن وتحتاج فقط إلى تحقيقه. ادخل إلى المستقبل اليوم واجعله يحدث.</p>
    </div>
    <div className="gpt3__features-container">
      {featuresData.map((item, index) => (
        <Feature title={item.title} text={item.text} key={item.title + index} />
      ))}
    </div>
  </div>
);

export default Features;
