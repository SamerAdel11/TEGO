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
endpoint = "http://localhost:8000/create_tender/"
data = {
    "ad": {
        "title": "Sample Tender",
        "topic": "Sample Topic",
        "deadline": "2024-04-10"
    },
    "admins": [
        {
            "name": "John Doe",
            "job_title": "Admin"
        },
        {
            "name": "Jane Doe",
            "job_title": "Manager"
        }
    ],
    "public_conditions": [
        {
            "condition": "Public Condition 1"
        },
        {
            "condition": "Public Condition 2"
        }
    ],
    "private_conditions": [
        {
            "condition": "Private Condition 1"
        },
        {
            "condition": "Private Condition 2"
        }
    ],
    "products": [
        {
            "title": "Product 1",
            "quantity_unit": "Unit",
            "quantity": "10",
            "description": "Description of Product 1"
        },
        {
            "title": "Product 2",
            "quantity_unit": "Kg",
            "quantity": "5",
            "description": "Description of Product 2"
        }
    ],
    "initial_price": 500,
    "status":"Open",
}


headers = {'Authorization': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzEyNjEwOTcyLCJpYXQiOjE3MTIxNzg5NzIsImp0aSI6IjQ1ZmQwODM1ZWFlNzRiYzFhNTYxMWZmNzZiMzRjNThmIiwidXNlcl9pZCI6NSwiZW1haWwiOiJzYW1lcmFkZWw3ODIyOUBnbWFpbC5jb20iLCJjb21wYW55X3R5cGUiOiJzdXBwbGllciJ9.zqGj2T6Bx5l8MT9t48aX2gmxvwQPx-MDugN6OgBX9zA"}
response = requests.post(endpoint, json=data,headers=headers)

print(response.json())
