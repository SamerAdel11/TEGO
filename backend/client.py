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
user_data = {
    "name": "Fake Company Inc.",
    "location": "123 Fake Street",
    "city": "Fakeville",
    "mobile": "1234567890",
    "landline": "0987654321",
    "fax_number": "5555555555",
    "company_type_tego": "supplier",
    "supplier": {
        "tax_card_number": "1234567890",
        "commercial_registration_number": "CR123456",
        "company_type": "Fake LLC",
        "company_capital": "900000"
    },
    "company_fields": [
        {
            "primary_field": "Fake Primary Activity 1",
            "secondary_field": "Fake Sub Activity 1"
        },
        {
            "primary_field": "Fake Primary Activity 2",
            "secondary_field": "Fake Sub Activity 2"
        }
    ],
    "user": {
        "first_name": "John",
        "last_name": "Doe",
        "email": "nardinphilip5@gmail.com",
        "password": "sameradel",
        "password2": "sameradel",
        "verified": True
    },
    "owners": [
        {
            "name": "Jane Doe",
            "owner_id": "ID123",
            "onwer_position": "CEO",
            "address": "456 Fake Avenue"
        },
        {
            "name": "Bob Smith",
            "owner_id": "ID456",
            "onwer_position": "CFO",
            "address": "789 Fake Boulevard"
        }
    ]
}
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

# tender_data
tender_data = {
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


endpoint = "http://localhost:8000/add_response/"
update = {
    "status": "can"
}
user_data = {
    "name": "Fake Company Inc.",
    "location": "123 Fake Street",
    "city": "Fakeville",
    "mobile": "1234567890",
    "landline": "0987654321",
    "fax_number": "5555555555",
    "company_type_tego": "supplier",
    "supplier": {
        "tax_card_number": "1234567890",
        "commercial_registration_number": "CR123456",
        "company_type": "Fake LLC",
        "company_capital": "900000"
    },
    "company_fields": [
        {
            "primary_field": "Fake Primary Activity 1",
            "secondary_field": "Fake Sub Activity 1"
        },
        {
            "primary_field": "Fake Primary Activity 2",
            "secondary_field": "Fake Sub Activity 2"
        }
    ],
    "user": {
        "first_name": "John",
        "last_name": "Doe",
        "email": "sameradel789@gmail.com",
        "password": "sameradel",
        "password2": "sameradel",
        "verified": True
    },
    "owners": [
        {
            "name": "Jane Doe",
            "owner_id": "ID123",
            "onwer_position": "CEO",
            "address": "456 Fake Avenue"
        },
        {
            "name": "Bob Smith",
            "owner_id": "ID456",
            "onwer_position": "CFO",
            "address": "789 Fake Boulevard"
        }
    ]
}
response_data = {
    'offer_conditions': [{'condition': 1, 'offered_condition': 'يجب أن '},
                         {'condition': 2, 'offered_condition': 'يجب أن'},
                         {'condition': 3, 'offered_condition': 'يجب أن'},
                         {'condition': 4, 'offered_condition': 'يجب أن'},
                         {'condition': 5, 'offered_condition': 'يجب على '},
                         {'condition': 6, 'offered_condition': 'يجب أن'}],
    'offer_products': [{'product_description': """كاميرات رقمية خارجية تعمل بتقنية
                                            IP، دقتها لا تقل عن 4 ميجا بكسل،
                                            مزودة بعدسات varifocal لتعديل 
                                            الزاوية حسب الحاجة، رؤية ليلية 
                                            بالأشعة تحت الحمراء بمدى لا يقل 
                                            عن 30 متر، غلاف مقاوم للظروف 
                                            الجوية الخارجية """,
                        'product_title': 'كاميرات مراقبة عالية الدقة',
                        'productid': 1,
                        'provided_quantity': '100',
                        'supplying_duration':"3 ايام عمل",
                        'supplying_status': 'متوفر'},
                       {'product_description': """أجهزة تسجيل رقمية متوافقة مع 
                                            كاميرات IP، سعة تخزين لا تقل عن 
                                            تيرابايت، تدعم خاصية التسجيل 
                                            المستمر بجودة عالية,""",
                        'product_title': 'أجهزة تسجيل ومراقبة رقمية',
                        'productid': 2,
                        'supplying_duration':"3 ايام عمل",
                        'provided_quantity': '10',
                        'supplying_status': 'متوفر'},
                       {'product_description': """لوحات تحكم متطورة قابلة للبرمجة،
                                            تدعم الاتصال الهاتفي والإنترنت 
                                            لإرسال إشعارات الإنذار، متوافقة 
                                            مع جميع أنظمة إنذار الحريق وأجهز
                                            قراءة بطاقات الدخول,""",
                        'product_title': 'لوحات تحكم بالإنذار',
                        'productid': 3,
                        'supplying_duration':"3 ايام عمل",
                        'provided_quantity': '200',
                        'supplying_status': 'متوفر'},
                       {'product_description': """حساس إنذار دخاني عالي الحساسية، 
                                            يصدر إنذارا مبكرا عند اكتشاف أي 
                                            دخان\\nإنذار حراري يستجيب لارتفا
                                            مفاجئ في درجة الحرارة'""",
                        'product_title': 'حساسات إنذار الحريق',
                        'productid': 4,
                        'supplying_duration':"3 ايام عمل",
                        'provided_quantity': '50',
                        'supplying_status': 'متوفر'},
                       {'product_description': """أجهزة قراءة بطاقات دخول متينة 
                                            ومقاومة للعبث، تعمل بتقنية RFID 
                                            وقراءة البصمة، متصلة بلوحات تحكم
                                            بالإنذار لمنع الدخول غير المصرح 
                                            به',""",
                        'product_title': 'أجهزة قراءة بطاقات الدخول',
                        'productid': 5,
                        'supplying_duration':"3 ايام عمل",
                        'provided_quantity': '10',
                        'supplying_status': 'متوفر'},
                       {'product_description': """أبواب دوارة مصنوعة من الفولاذ 
                                            المقاوم للصدأ ومزودة بنظام إنذار
                                            عند محاولة الدخول غير المصرح به،
                                            تتكامل مع أجهزة قراءة بطاقات 
                                            الدخول,""",
                        'product_title': 'أبواب دوارة أمنية',
                        'productid': 6,
                        'provided_quantity': '10',
                        'supplying_duration':"3 ايام عمل",
                        'supplying_status': 'متوفر'}],
                        'tender_id':1,
                        'status':'offered',
                        'offered_price': '900', }

samer_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE1NTMzNjA4LCJpYXQiOjE3MTUxMDE2MDgsImp0aSI6ImI3ZTdiZDU4Y2U5ZTQ0ZDY5ZTA3NmVjYzAzYTI4MGI2IiwidXNlcl9pZCI6MSwiZW1haWwiOiJzYW1lcmFkZWw3ODlAZ21haWwuY29tIiwiY29tcGFueV90eXBlIjoic3VwcGxpZXIifQ.fkSgMV9NygHtIVKotddrJoWoeG2sbzbrEendE6WFnLw'
fady_token ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE1NjM2OTgyLCJpYXQiOjE3MTUyMDQ5ODIsImp0aSI6IjA1ODg2NWE4ZTAwODQ1MzI5MGJiZmIwNjZhMWRhNTQ3IiwidXNlcl9pZCI6MiwiZW1haWwiOiJzYW1lcmFkZWw3ODlAZ21haWwuY29tIiwiY29tcGFueV90eXBlIjoic3VwcGxpZXIifQ.RwKAuTKNnS9JmQtVpvJMifoCRTWOWu8ja3YZYw9QFXg'

nardin_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE0NTA2MjE0LCJpYXQiOjE3MTQwNzQyMTQsImp0aSI6ImVhZDA2ZGU2MDQ4ZTQyZTU5YzI5NGNhZDcxZWQwNDFkIiwidXNlcl9pZCI6MSwiZW1haWwiOiJuYXJkaW5waGlsaXA1QGdtYWlsLmNvbSIsImNvbXBhbnlfdHlwZSI6InN1cHBsaWVyIn0.V4BMDnANqkYZrIFS3DN9lD0gbT_58McaCYhu1nU5xGU'

headers = {'Authorization': f"Bearer {fady_token}"}
# endpoint = 'http://localhost:8000/companies/'
# response = requests.post(endpoint, json=user_data)

# endpoint = 'http://localhost:8000/create_tender/'
# response = requests.post(endpoint, headers=headers, json=tender_data)

endpoint = 'http://localhost:8000/add_response/'
response = requests.post(endpoint, headers=headers, json=response_data)

pprint.pprint(response.json())

######################################################################## IMPORAAAAAAAAAAAAAAAAAANT##################################
# http://localhost:8000/get_responses/ --------> get all responses
# http://localhost:8000/add_responses/ --------> add new response
