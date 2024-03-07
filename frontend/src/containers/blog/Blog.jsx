import React from 'react';
import Article from '../../components/article/Article';
import { blog01, blog02, blog03, blog04, blog05 } from './imports';
import './blog.css';

const Blog = () => (
  <div className="gpt3__blog section__padding" id="blog">
    <div className="gpt3__blog-heading">
      <h1 className="gradient__text">الخاتمة</h1>
      <p>TEGO عبارة عن منصة على الإنترنت تحل محل إعلانات الصحف التقليدية. يؤدي ذلك إلى تسريع عملية المناقصة ويجعل مجال المناقصة في متناول الجميع. كما أنه يقوم بتحويل كتيب الشروط والأحكام إلى صيغة رقمية، مما يوفر رؤى تفصيلية لمقدمي العروض المحتملين، ويعزز الفهم، ويضمن عثور العميل على المورد المطابق تمامًا.</p>
    </div>
    <div className="gpt3__blog-container">
      <div className="gpt3__blog-container_groupA">
        <Article imgUrl={blog01} text="نهدف إلى بناء منصة تنتج طبقة شفافة بين مقدمي العطاءات ومقدمي العطاءات لتحقيق العدالة وإزالة أي تحيز بشري في التفاعل" />
      </div>
      <div className="gpt3__blog-container_groupB">
        <Article imgUrl={blog02} text="قم بإنشاء منصة للمناقصات يمكن أن تشمل عمليات الشراء عبر مختلف الصناعات والقطاعات والموردين من مختلف الأحجام." />
        <Article imgUrl={blog03} text="إشراك شركات النقل في عملية المناقصة." />
        <Article imgUrl={blog04} text="رقمنة وثائق وعقود المشتريات." />
        <Article imgUrl={blog05} text="تتبع عملية الشراء من خلال النظام الأساسي." />
      </div>
    </div>
  </div>
);

export default Blog;
