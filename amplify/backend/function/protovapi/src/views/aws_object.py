import os
import re
from uuid import uuid4
import datetime
from services.aws_object import AwsObjectService, get_objects
from services.aws_transaction import AwsTransactionService
import schemas
from flask import Blueprint, jsonify, request
import json
import boto3
from boto3.dynamodb.conditions import Key


BASE_ROUTE = "/"

PROTOV_TABLE = os.environ.get("STORAGE_DYNAMODB_NAME")
PROTOV_TRANSACTION_TABLE = os.environ.get("STORAGE_DYNAMODBTRANSACTION_NAME")

aws_object_blueprint = Blueprint(BASE_ROUTE, __name__)

client = boto3.client('dynamodb')


@aws_object_blueprint.route(BASE_ROUTE + 'protovobject', methods=["POST"])
def create_object() -> schemas.AddObjectResponse:
    request_json: schemas.AddObject = request.get_json()
    print("create_object: request_json =>> ", request_json)
    object = request_json.get('object_image')
    object_file_key = request_json.get('image_file_key')
    year = request_json.get('year')
    title = request_json.get('title')
    methods1 = request_json.get('methods1')
    methods2 = request_json.get('methods2')
    image_method2_key = request_json.get('image_method2_key')

    # save data object to db (protov_table)
    response: schemas.CreateObjectResponse = AwsObjectService.create_aws_object(
        client, request_json)

    id_object = response["id_object"]
    artist_id = response["artist_id"]
    artist_firstname = response['artist_firstname']
    artist_surname = response['artist_surname']
    add_object_success = response['add_object_success']

    # create owner id for transaction of this created object
    owner_id = uuid4().hex

    # data for transaction
    transaction_data = {
        "owner_id": owner_id,
        "id_object": id_object,
        "methods1": methods1,
        "methods2": methods2
    }

    # create transaction for add object
    transaction = AwsTransactionService.create_transaction(
        client, transaction_data)
    print("create_object: transaction => ", transaction)

    return jsonify(message={
        "id_object": id_object,
        "artist_id": artist_id,
        "owner_id": owner_id,
        "new_owner_id": "",
        "artist_firstname": artist_firstname,
        "artist_surname": artist_surname,
        "object": object,
        "object_file_key": object_file_key,
        "year": year,
        "title": title,
        "methods1": methods1,
        "methods2": methods2,
        "image_method2_key": image_method2_key,
        "add_object_success": add_object_success,
    })


@aws_object_blueprint.route(BASE_ROUTE + 'protovobject', methods=["GET"])
def list_objects():
    data = client.scan(TableName=PROTOV_TABLE)
    print("list_objects: data =>", data)
    return jsonify(data=data)


@aws_object_blueprint.route(BASE_ROUTE + 'protovobject/enter_info', methods=['POST'])
def verify_objects():
    request_json = request.get_json()

    search_item = request_json.get('search_item')
    id_object = request_json.get('id_object')
    print("verify_objects: id_object =>>>> ", id_object)
    surname = request_json.get('artist_surname')
    name = request_json.get('artist_firstname')
    title = request_json.get('title')
    year = request_json.get('year')

    send_data = [name, surname, title, year, id_object]
    length_send_data = len([value for value in send_data if value])

    objects = get_objects()

    objects_data = []

    for obj in objects['Items']:

        verify_data = [obj['artist_firstname']['S'], obj['artist_surname']
                       ['S'], obj['title']['S'], obj['year']['S'], obj['id_object']['S']]

        var_objects = [i for i, j in zip(send_data, verify_data) if i == j]
        length_var_objects = len([value for value in var_objects if value])

        if length_var_objects == length_send_data:
            objects_data.append(obj)

    if len(objects_data) > 0:
        object_services = AwsObjectService()
        objects_data = [object_services.get_object_info(
            obj, search_item) for obj in objects_data]
    return jsonify(data=objects_data)


@aws_object_blueprint.route(BASE_ROUTE + 'protovobject/object', methods=["POST"])
def get_object():
    request_json = request.get_json()
    print("get_object: request_json => ", request_json)
    id_object = request_json.get('id_object')
    print("get_object: id_object => ", id_object)

    artist_surname = request_json.get('artist_surname')
    artist_firstname = request_json.get('artist_firstname')
    # title = request_json.get('title')
    # year = request_json.get('year')

    objects = get_objects()

    objects_data = []
    for obj in objects['Items']:
        is_verify_artist = obj['artist_firstname']['S'] == artist_firstname and obj['artist_surname']['S'] == artist_surname
        if obj['id_object']['S'] == id_object and is_verify_artist or obj['id_object']['S'] == id_object:
            objects_data.append(obj)
        print("get_object: objects_data => ", objects_data)
    if len(objects_data) > 0:
        objects_data = [{
            'artist_firstname': obj['artist_firstname']['S'],
            'artist_id': obj['artist_id']['S'],
            'artist_surname': obj['artist_surname']['S'],
            'id_object': obj['id_object']['S'],
            'image_file_key': obj['image_file_key']['S'],
            'image_method2_key': obj['image_method2_key']['S'],
            'methods1': obj['methods1']['S'],
            'methods2': obj['methods2']['S'],
            'object_image': obj['object_image']['S'],
            'title': obj['title']['S'],
            'year': obj['year']['S'],
        } for obj in objects_data]
    return jsonify(data=objects_data)


@aws_object_blueprint.route(BASE_ROUTE + 'transactionobject/verify_owner', methods=["POST"])
def verify_owner():
    request_json = request.get_json()
    id_object = request_json.get('id_object')
    password = request_json.get('owner_password')

    objects = get_objects()
    objects_transaction = AwsTransactionService.get_transaction_objects()

    modify_objects_transaction = []
    if len(objects_transaction) > 0:
        for obj in objects_transaction['Items']:
            for key, value in obj.items():
                obj[key] = value["S"]

            modify_objects_transaction.append(obj)

    print("verify_owner: modify_objects_transaction =>>>",
          modify_objects_transaction)

    # print("verify_owner: sorted_objects_transaction =>>>",
    #       sorted_objects_transaction)

    object = None
    for obj in objects['Items']:
        if obj['id_object']['S'] == id_object:
            object = obj

    verify_objects = []
    for obj in modify_objects_transaction:
        if obj['id_object'] == id_object:
            verify_objects.append(obj)

    def verify_object_info(object, verify_object_pass: str, enter_password: str):
        print("verify_object_info => verify_object_pass ", verify_object_pass)
        print("verify_object_info => enter_password ", enter_password)
        if verify_object_pass.strip() == enter_password.strip():
            return {
                "artist_surname": object['artist_surname']['S'],
                "artist_firstname": object['artist_firstname']['S'],
                "title": object['title']['S'],
                "year": object['year']['S'],
                "id_object": object['id_object']['S'],
                "owner_ver_status": True
            }
        else:
            return {
                "artist_surname": object['artist_surname']['S'],
                "artist_firstname": object['artist_firstname']['S'],
                "title": object['title']['S'],
                "year": object['year']['S'],
                "id_object": id_object,
                "owner_ver_status": False
            }
    if len(verify_objects) > 1:
        sorted_verify_objects = sorted(
            verify_objects, key=lambda row: row['date'])
        print("==>>> verify_owner: sorted_verify_objects ", sorted_verify_objects)
        print("==>>> verify_owner: verify_object ", sorted_verify_objects[-1])
        verify_object = sorted_verify_objects[-1]
        print("verify_object_info => verify_object ", verify_object)
        print("verify_object_info => password ", password)
        id = verify_object['new_owner_id']
        if len(id) == 0:
            id = verify_object['owner_id']
        return verify_object_info(object, id, password)
    elif len(verify_objects) == 1:
        return verify_object_info(object, verify_objects[0]['owner_id'], password)


@aws_object_blueprint.route(BASE_ROUTE + 'protovobject/<id_object>', methods=['DELETE'])
def delete_object(id_object):
    client.delete_item(
        TableName=PROTOV_TABLE,
        Key={'id_object': {'S': id_object}})
    return jsonify(message='object deleted')


@aws_object_blueprint.route(BASE_ROUTE + 'protovobject/add_method', methods=['POST'])
def add_method():
    request_json = request.get_json()
    artist_id = request_json.get("artist_id")
    id_object = request_json.get("id_object")
    methods1 = request_json.get("methods1")
    methods2 = request_json.get("methods2")
    image_method2_key = request_json.get("image_method2_key")

    objects = get_objects()
    transaction_objects = AwsTransactionService.get_transaction_objects()

    modify_objects_transaction = []
    if len(transaction_objects) > 0:
        for obj in transaction_objects['Items']:
            for key, value in obj.items():
                obj[key] = value["S"]

            modify_objects_transaction.append(obj)

    print("verify_owner: modify_objects_transaction =>>>",
          modify_objects_transaction)

    object = None
    for obj in objects['Items']:
        if obj['id_object']['S'] == id_object:
            object = obj

    transaction_objects = []
    for obj in modify_objects_transaction:
        if obj['id_object'] == id_object:
            transaction_objects.append(obj)

    transaction_object = None
    if len(transaction_objects) > 0:
        sorted_verify_objects = sorted(
            transaction_objects, key=lambda row: row['date'])
        transaction_object = sorted_verify_objects[-1]

    if object and transaction_object:
        client.put_item(TableName=PROTOV_TABLE, Item={
            "id_object": {'S': id_object},
            "artist_surname": {'S': object['artist_surname']['S']},
            "artist_firstname": {'S': object['artist_firstname']['S']},
            "artist_id": {'S': object['artist_id']['S']},
            "methods1": {'S': methods1 if methods1 else object['methods1']['S']},
            "methods2": {'S': methods2 if methods2 else object['methods2']['S']},
            "image_method2_key": {'S': image_method2_key if len(methods2) > 0 else object['image_method2_key']['S']},
            "object_image": {'S': object['object_image']['S']},
            "image_file_key": {'S': object['image_file_key']['S']},
            "year": {'S': object['year']['S']},
            "title": {'S': object['title']['S']},
        })

        today = datetime.datetime.today().strftime("%m/%d/%Y, %H:%M:%S")
        action = transaction_object['action']
        print("add => id_transaction",
              transaction_object['id_transaction'])
        print("add => methods1", methods1)
        print("add => methods2", methods2)

        if len(methods1) > 0 or len(methods2) > 0:
            action = 'added'

        print("add => action", action)
        id_transaction = str(uuid4())
        client.put_item(TableName=PROTOV_TRANSACTION_TABLE, Item={
            "id_transaction": {'S': id_transaction},
            "id_object": {'S': id_object},
            "action": {'S': action},
            "date": {'S': today},
            "methods1": {'S': methods1 if methods1 else ""},
            "methods2": {'S': methods2 if methods2 else ""},
            "owner_id": {'S': transaction_object['owner_id']},
            "new_owner_id": {'S': transaction_object['new_owner_id']},
        })

        return jsonify(message={"add_method_success": True})
    return jsonify(message={"add_method_success": False})
