import requests
import json

# endpoint = "http://127.0.0.1:8000/auth/"
# register = {'username': "admin",
#             'password': "admin"
#             }
# auth_response = requests.post(endpoint, json=register)
# print(auth_response.json())

# if auth_response.status_code == 200:

# token=auth_response.json()['token']
endpoint = "http://localhost:8000/companies/"
data = {
    "name": "pp",
    "location": " hhhhhhhhhhhhhh",
    "commercial_registration_number": "6345346464",
    "tax_card_number": "423423",
    "mobile": "23423",
    "landline": "9999",
    "fax_number": "7567",
    "company_type": "supplier",
    "company_capital": 123445,
    "user": {
        "first_name": "Fady",
        "last_name": "Malek",
        "email": "fady@malek.com",
        "mobile_number": "0123654654",
        "password": "fadymalek"
    },
    "owners": [
        {"name": "Samer A1111111del",
         "owner_id": "3123123",
         "onwer_position": "manager",
         "address": "street xyz"},
        {"name": "Bassem Adel",
         "owner_id": "123",
         "onwer_position": "CEO",
         "address": "street xyz"},
        {"name": "Adel",
         "owner_id": "96767",
         "onwer_position": "not manager",
         "address": "street xyz"}
    ]
}

headers = {'Authorization': "Token 0d098c479db6cb5f95971a9c0dc74a23ebfb0682"}
response = requests.post(endpoint, json=data)

print(response)
