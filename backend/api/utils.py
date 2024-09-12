from . import models
from django.db import transaction
import requests
from pprint import pprint
@transaction.atomic
def update_model_fields(instance, **fields):
    for field, value in fields.items():
        setattr(instance, field, value)
    instance.save()

def update_or_create_response_product_objects(self,model,tender_product_model,related_data,field_name):
    for data in related_data:
        obj_id=data.pop('id',None)
        if obj_id:
            obj=model.objects.get(id=obj_id)
            update_model_fields(obj,**data)
        else:
            tender_product_instance=tender_product_model.objects.get(id=data.pop('productid'))
            model.objects.create(
                **data,
                product=tender_product_instance,
                **{field_name: self})

def create_related_objects(self, model, related_data, field_name):

    if isinstance(related_data,dict):
        related_data.pop('id', None)
        model.objects.create(**related_data, **{field_name: self})
    else:
        for data in related_data:
            data.pop('id', None)
            model.objects.create(**data, **{field_name: self})

def update_or_create_related_objects(self, model, related_data, field_name):

    if isinstance(related_data,dict):
        obj_id = related_data.pop('id', None)
        if obj_id:
            obj = model.objects.get(id=obj_id)
            update_model_fields(obj,**related_data)
        else:
            model.objects.create(**related_data, **{field_name: self})
    else:
        for data in related_data:
            obj_id = data.pop('id', None)
            if obj_id:
                obj = model.objects.get(id=obj_id)
                update_model_fields(obj,**data)
            else:
                model.objects.create(**data, **{field_name: self})


def extract_keys_and_values(data, parent_key='', sep='_'):
    keys = []
    values = []
    if isinstance(data, dict):
        for k, v in data.items():
            new_key = f"{parent_key}{sep}{k}" if parent_key else k
            keys.append(new_key)
            if isinstance(v, (dict, list)):
                nested_keys, nested_values = extract_keys_and_values(v, new_key, sep=sep)
                if keys =='admins' or keys =='public_conditions' or keys=='private_conditions' or keys == 'products' or keys =='ad':
                    values.extend(nested_values)
                else:
                    values.extend(nested_values)
                    keys.extend(nested_keys)
            else:
                values.append(str(v))
    elif isinstance(data, list):
        for i, item in enumerate(data):
            new_key = f"{parent_key}{sep}{i}"
            nested_keys, nested_values = extract_keys_and_values(item, new_key, sep=sep)
            keys.extend(nested_keys)
            values.extend(nested_values)
    return keys, values

def assign_empty_values_to_json(data):
    if isinstance(data, dict):
        for k in data.keys():
            if isinstance(data[k], (dict, list)):
                assign_empty_values_to_json(data[k])
            else:
                data[k] = ""
    elif isinstance(data, list):
        for i in range(len(data)):
            if isinstance(data[i], (dict, list)):
                assign_empty_values_to_json(data[i])
            else:
                data[i] = ""
    return data

def assign_values_from_list(json_with_empty_values, values_list):
    value_index = 0
    def assign_values(data):
        nonlocal value_index
        if isinstance(data, dict):
            for k in data.keys():
                if isinstance(data[k], (dict, list)):
                    assign_values(data[k])
                else:
                    if value_index < len(values_list):
                        data[k] = values_list[value_index].strip()
                        value_index += 1
        elif isinstance(data, list):
            for i in range(len(data)):
                if isinstance(data[i], (dict, list)):
                    assign_values(data[i])
                else:
                    if value_index < len(values_list):
                        data[i] = values_list[value_index].strip()
                        value_index += 1
    assign_values(json_with_empty_values)
    return json_with_empty_values

def toggle_anonymity(json_data,anonymize,object_type,object_id):
    admins=None
    status=json_data.pop('status',None)
    field=None
    if object_type =='t':
        admins=json_data.pop('admins',None)
        ad_data=json_data.get('ad',None)
        field=ad_data.pop('field',None)  if ad_data  else  None

    keys,values=extract_keys_and_values(json_data)
    values_string = (" , ".join(values))
    empty_json=assign_empty_values_to_json(json_data)

    url= "http://127.0.0.1:9000/predict/" if anonymize else "http://127.0.0.1:9000/decrypt/"
    headers = {
        "Content-Type": "application/json"
    }
    params={
        "input_data":values_string,
        "object_type":'t' if object_type== 'r as t' else object_type,
        "object_id":object_id
    }
    try:
        print(params)
        response = requests.post(url, params=params, headers=headers)
        response.raise_for_status()  # Raise an HTTPError for bad responses (4xx and 5xx)
        annonmyized_data=response.json().get('prediction').split(',')
        new_json_data=assign_values_from_list(empty_json,annonmyized_data)
        new_json_data['status']=status if status else None
        if object_type =='t':
            new_json_data['admins']=admins if admins else None
            new_json_data['ad']['field']=field if field else None
        return new_json_data
    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")  # Handle HTTP errors
        return None
    except Exception as err:
        print(f"An error occurred: {err} {err.text}")  # Handle other possible errors
        return None