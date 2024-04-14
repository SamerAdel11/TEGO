import requests
import json
import pprint
# endpoint = "http://127.0.0.1:8000/auth/"
# register = {'username': "admin",
#             'password': "admin"
#             }
# auth_response = requests.post(endpoint, json=register)
# print(auth_response.json())

# if auth_response.status_code == 200:

# token=auth_response.json()['token']
endpoint = "http://localhost:8000/add_response/"
# data = {
#     "ad": {
#         "title": "Sample Tender",
#         "topic": "Sample Topic",
#         "deadline": "2024-04-10",
#         "field":"اجهزه منزليه",
#     },
#     "admins": [
#         {
#             "name": "John Doe",
#             "job_title": "Admin"
#         },
#         {
#             "name": "Jane Doe",
#             "job_title": "Manager"
#         }
#     ],
#     "public_conditions": [
#         {
#             "condition": "Public Condition 1"
#         },
#         {
#             "condition": "Public Condition 2"
#         }
#     ],
#     "private_conditions": [
#         {
#             "condition": "Private Condition 1"
#         },
#         {
#             "condition": "Private Condition 2"
#         }
#     ],
#     "products": [
#         {
#             "title": "Product 1",
#             "quantity_unit": "Unit",
#             "quantity": "10",
#             "description": "Description of Product 1"
#         },
#         {
#             "title": "Product 2",
#             "quantity_unit": "Kg",
#             "quantity": "5",
#             "description": "Description of Product 2"
#         }
#     ],
#     "initial_price": 500,
#     "status":"Open",
# }

#tender_data
data={
  "ad": {
    "title": "توريد وتركيب أنظمة أمن متكاملة لمشروع مجمع النخبة السكني",
    "topic": "شروع مجمع النخبة السكني هو مشروع سكني راقي قيد الإنشاء، يتكون من 10 مبنى سكني فخم يحتوي على 500 شقة سكنية، بالإضافة إلى المرافق المشتركة مثل حمام سباحة، صالة ألعاب رياضية، وقاعات متعددة الاستخدامات. لضمان أعلى مستوى من الأمن والسلامة للسكان والممتلكات، تنوي شركة النخبة للمقاولات طرح مناقصة لتوريد وتركيب أنظمة أمن متكاملة تشمل أنظمة مراقبة بالكاميرات، إنذار الحريق، والتحكم بالدخول",
    "deadline": "2024-05-09",
    "field": "اجهزه منزليه"
  },
  "admins": [
    {
      "name": "خالد المصري",
      "job_title": "رئيس اللجنة - مدير المشروع"
    },
    {
      "name": "سارة إبراهيم",
      "job_title": "عضو اللجنة - مهندسة أمن"
    },
    {
      "name": "أحمد محمد",
      "job_title": "عضو اللجنة - مسؤول المشتريات"
    },
    {
      "name": "أحمد عبد الرحمن",
      "job_title": "رئيس اللجنة - مدير عام الشركة"
    },
    {
      "name": "محمد علي",
      "job_title": "عضو اللجنة - نائب المدير العام"
    },
    {
      "name": "هبة أحمد",
      "job_title": "عضو اللجنة - خبيرة في أنظمة الأمن"
    }
  ],
  "public_conditions": [
    {
      "condition": "يجب أن تكون الشركة مرخصة في مجال توريد وتركيب أنظمة الأمن المتكاملة."
    },
    {
      "condition": "يجب أن يكون لدى الشركة خبرة لا تقل عن 5 سنوات في تنفيذ مشاريع أمنية مماثلة."
    },
    {
      "condition": "يجب أن تكون المنتجات حديثة الإصدار."
    },
    {
      "condition": "يجب على الشركة تقديم ضمانة بنكية بقيمة 10% من قيمة العقد."
    },
    {
      "condition": "يجب على الشركة تقديم ضمان على جميع المنتجات والأنظمة لمدة لا تقل عن سنة واحدة."
    },
    {
      "condition": "يجب أن تكون عروض الأسعار شاملة جميع تكاليف المعدات والتركيب والتشغيل والصيانة."
    },
    {
      "condition": "سيتم توقيع عقد بين شركة النخبة للمقاولات والشركة الفائزة بالمناقصة."
    },
    {
      "condition": "يجب أن يتضمن العقد جميع شروط المناقصة."
    },
  ],
  "private_conditions": [
    {
      "condition": "يجب أن تقدم الشركة قائمة بأعمال مماثلة نفذتها في السابق."
    },
    {
      "condition": "يجب أن تكون الشركة قد نفذت مشاريع أمنية لمجمعات سكنية مشابهة في الحجم والتعقيد."
    },
    {
      "condition": "يجب أن تكون الشركة قد نفذت مشاريع أمنية لمجمعات سكنية مشابهة في الحجم والتعقيد."
    },
    {
      "condition": "يجب أن تقدم الشركة ضماناً على جميع المنتجات والأنظمة لمدة لا تقل عن سنة واحدة."
    },
    {
      "condition": "يجب على الشركة تقديم جدول زمني للتنفيذ يوضح مدة إنجاز المشروع."
    },
    {
      "condition": "يجب أن يتم إنجاز المشروع في مدة لا تزيد عن 6 أشهر."
    },
  ],
  "products": [
    {
      "title": "كاميرات مراقبة عالية الدقة",
      "quantity_unit": "عدد",
      "quantity": "100",
      "description": "كاميرات رقمية خارجية تعمل بتقنية IP، دقتها لا تقل عن 4 ميجا بكسل، مزودة بعدسات varifocal لتعديل الزاوية حسب الحاجة، رؤية ليلية بالأشعة تحت الحمراء بمدى لا يقل عن 30 متر، غلاف مقاوم للظروف الجوية الخارجية"
    },
    {
      "title": "أجهزة تسجيل ومراقبة رقمية",
      "quantity_unit": "عدد",
      "quantity": "20",
      "description": "أجهزة تسجيل رقمية متوافقة مع كاميرات IP، سعة تخزين لا تقل عن 1 تيرابايت، تدعم خاصية التسجيل المستمر بجودة عالية"
    },
    {
      "title": "لوحات تحكم بالإنذار",
      "quantity_unit": "عدد",
      "quantity": "10",
      "description": "لوحات تحكم متطورة قابلة للبرمجة، تدعم الاتصال الهاتفي والإنترنت لإرسال إشعارات الإنذار، متوافقة مع جميع أنظمة إنذار الحريق وأجهزة قراءة بطاقات الدخول"
    },
    {
      "title": "حساسات إنذار الحريق",
      "quantity_unit": "عدد",
      "quantity": "200",
      "description": "حساس إنذار دخاني عالي الحساسية، يصدر إنذارا مبكرا عند اكتشاف أي دخان\nإنذار حراري يستجيب لارتفاع مفاجئ في درجة الحرارة"
    },
    {
      "title": "أجهزة قراءة بطاقات الدخول",
      "quantity_unit": "عدد",
      "quantity": "50",
      "description": "أجهزة قراءة بطاقات دخول متينة ومقاومة للعبث، تعمل بتقنية RFID وقراءة البصمة، متصلة بلوحات تحكم بالإنذار لمنع الدخول غير المصرح به"
    },
    {
      "title": "أبواب دوارة أمنية",
      "quantity_unit": "عدد",
      "quantity": "10",
      "description": "أبواب دوارة مصنوعة من الفولاذ المقاوم للصدأ ومزودة بنظام إنذار عند محاولة الدخول غير المصرح به، تتكامل مع أجهزة قراءة بطاقات الدخول"
    }
  ],
  "initial_price": 700000,
  "status": "Open"
}

response_data={
    "offered_price": 90000, 
    "tender_id": 19, 
    'status':'open',
    "offer_products": [
        {
            "productid": 38,
            "supplying_status": False,
        },
        {
            "productid": 36,
            "provided_quantity": 20,
            "product_price": 50,
            "supplying_duration": "15 working days",
            "supplying_status": True,
            "product_description": """
            سعة التخزين: سعة تخزين عالية (على سبيل المثال، 2 تيرابايت أو أعلى) لتخزين لقطات الفيديو لفترات طويلة.
            القدرة على التسجيل : القدرة على تسجيل الفيديو بنفس دقة الكاميرات (على سبيل المثال، Full HD أو 4K). 
            ضغط الفيديو : برنامج ترميز H.264 أو H.265 لإدارة التخزين بكفاءة. 
            الوصول عن بعد : القدرة على المشاهدة عن بعد للقطات الحية والمسجلة من خلال متصفح الويب أو تطبيق الهاتف المحمول.
            """
        },
        {
            "productid": 35,
            "provided_quantity": 100,
            "product_price": 30,
            "supplying_duration": "10 working days",
            "supplying_status": True,
            "product_description": """
              النوع المحدد : مستشعر CMOS أو CCD بدقة عالية (الحد الأدنى 1080 بكسل) لالتقاط صور واضحة ومفصلة.
              دقة الصورة : الحد الأدنى 1920 × 1080 بكسل (Full HD) أو أعلى (على سبيل المثال، 4K) للحصول على جودة صورة فائقة. 
              عدسة متغيرة البؤرة: تسمح بضبط مجال الرؤية لتحسين تغطية مناطق معينة. 
              الرؤية الليلية : مصابيح الأشعة تحت الحمراء (IR) أو تقنية ضوء النجوم للحصول على رؤية واضحة في ظروف الإضاءة المنخفضة. 
              مقاومة للظروف الجوية : حاوية ذات تصنيف IP (على سبيل المثال، IP66) لتحمل البيئات الخارجية.
            """,
        },
    ],
    "offer_conditions": [
        {
            "condition": "مدة الضمان (Warranty Period): نقدم ضمان شامل لمدة [3] سنة على جميع المنتجات والأعمال التي يتم توريدها وتركيبها "
        },
        {
            "condition": "صيانة ما بعد البيع (After-Sales Maintenance): نلتزم بتقديم خدمات صيانة ما بعد البيع لمدة [1] سنة بعد اكتمال المشروع. تشمل هذه الخدمات الفحص الدوري والصيانة الوقائية لأجهزة الأمن بالإضافة إلى الاستجابة لأي أعطال فنية خلال فترة الضمان وبعدها وفقاً لاتفاقية صيانة منفصلة "
        },
        {
          "condition":"برنامج التدريب (Training Program): نقدم برنامج تدريبي مجاني لفريق الأمن في مجمع النخبة السكني على كيفية استخدام أنظمة الأمن الجديدة"
        }
    ]
}



endpoint = "http://localhost:8000/add_response/"

samer_token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzEzMzMxOTkzLCJpYXQiOjE3MTI4OTk5OTMsImp0aSI6IjA5MTg2Mzc0MTQ4NjQ5ZTNiY2IyMzNjNzdkZWYzZmY5IiwidXNlcl9pZCI6OSwiZW1haWwiOiJzYW1lcmFkZWw3ODk5QGdtYWlsLmNvbSIsImNvbXBhbnlfdHlwZSI6InN1cHBsaWVyIn0.kSOVnLx-6zrsc8UIetDexml1cJVsqD9_obGPMqNb6ME'
fady_token='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzEyOTYxMDkyLCJpYXQiOjE3MTI1MjkwOTIsImp0aSI6ImNjYWNjNDdhMWE0OTQ0MmRhMTcwZDM2MzQ1MTlhMzg4IiwidXNlcl9pZCI6MSwiZW1haWwiOiJzYW1lcmFkZWw3ODlAZ21haWwuY29tIiwiY29tcGFueV90eXBlIjoiYnV5ZXIifQ.oo7F7sNo8XXAjR7JlFpvdCzPeuuOrgyaeE4a1FwbldY'
headers = {'Authorization': f"Bearer {fady_token}"}
response = requests.post(endpoint, headers=headers,json=response_data)

pprint.pprint(response.json())

