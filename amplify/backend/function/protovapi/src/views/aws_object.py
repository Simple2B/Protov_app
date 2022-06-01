import os
from uuid import uuid4
import datetime
from services.aws_object import AwsObjectService
from services.aws_transaction import AwsTransactionService
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
def create_object():
    request_json = request.get_json()
    response = AwsObjectService.create_aws_object(client, request_json)
    print("create_object: AwsObjectService response =>> ", response)
    artist_id = response["artist_id"]
    id_object = response["id_object"]
    owner_id = uuid4().hex
    print("create_object: owner_id => ", artist_id)
    print("create_object: id_object => ", id_object)
    transaction = AwsTransactionService.create_transaction(
        client, request_json, owner_id, id_object)
    print("create_object: transaction => ", transaction)
    return jsonify(message={
        "add_object_success": 'true',
        "artist_surname": response['artist_surname'],
        "artist_firstname": response['artist_firstname'],
        "artist_id": artist_id,
        "id_object": id_object,
        "owner_id": owner_id,
        "object": response['object'],
        "object_file_key": response['object_file_key'],
        "year": response['year'],
        "title": response['title'],
        "methods1": response['methods1'],
        "methods2": response['methods2'],
        "image_method2_key": response['image_method2_key'],
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
    surname = request_json.get('artist_surname')
    name = request_json.get('artist_firstname')
    title = request_json.get('title')
    year = request_json.get('year')

    objects = AwsObjectService.get_objects()

    objects_data = []

    # search_items = ['Verify owner', 'Transact', 'Provenance', 'Verify object']

    for obj in objects['Items']:
        is_artist_verify = obj['artist_firstname']['S'] == name and obj['artist_surname']['S'] == surname
        is_object_verify = obj['title']['S'] == title and obj['year']['S'] == year
        if search_item == 'Verify owner':
            if is_artist_verify and obj['id_object']['S'] == id_object:
                objects_data.append(obj)
        if search_item == 'Transact':
            if is_artist_verify or obj['id_object']['S'] == id_object or is_object_verify:
                objects_data.append(obj)
        if search_item == 'Provenance':
            if is_artist_verify and obj['id_object']['S'] == id_object or is_artist_verify or obj['id_object']['S'] == id_object:
                objects_data.append(obj)
        if search_item == 'Verify object':
            if is_object_verify or obj['id_object']['S'] == id_object:
                objects_data.append(obj)

    if len(objects_data) > 0:
        # seen = set()
        # unique_objects_data = [
        #     obj for obj in objects_data if obj['id_object']['S'] not in seen and not seen.add(obj['id_object']['S'])]

        # print("unique_objects_data ", unique_objects_data)

        object_services = AwsObjectService()

        # if search_item == 'Provenance':
        #     objects = unique_objects_data

        objects_data = [object_services.get_object_info(
            obj, search_item) for obj in objects_data]
    return jsonify(data=objects_data)


@aws_object_blueprint.route(BASE_ROUTE + 'protovobject/<id_object>', methods=["GET"])
def get_object(id_object):
    objects = AwsObjectService.get_objects()
    print("verify_object: id_object => ", id_object)
    print("verify_object: objects['Items'] => ", objects['Items'])
    objects_data = []
    for obj in objects['Items']:
        print("verify_object: obj => ", obj)
        if obj['id_object']['S'] == id_object:
            objects_data.append(obj)
        print("verify_object: objects_data => ", objects_data)
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

    objects = AwsObjectService.get_objects()
    objects_transaction = AwsTransactionService.get_transaction_objects()

    object = None
    for obj in objects['Items']:
        if obj['id_object']['S'] == id_object:
            object = obj

    verify_object = None
    for obj in objects_transaction['Items']:
        if obj['owner_id']['S'] == password:
            verify_object = obj

    if object and verify_object and object['id_object']['S'] == verify_object['id_object']['S']:
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
    method1 = request_json.get("method1")
    method2 = request_json.get("method2")
    image_method2_key = request_json.get("image_method2_key")

    objects = AwsObjectService.get_objects()
    transaction_objects = AwsTransactionService.get_transaction_objects()

    object = None
    for obj in objects['Items']:
        if obj['id_object']['S'] == id_object and obj['artist_id']['S'] == artist_id:
            object = obj

    transaction_object = None
    for obj in transaction_objects['Items']:
        if obj['id_object']['S'] == id_object:
            transaction_object = obj

    if object and transaction_object:
        client.put_item(TableName=PROTOV_TABLE, Item={
            "id_object": {'S': id_object},
            "artist_surname": {'S': object['artist_surname']['S']},
            "artist_firstname": {'S': object['artist_firstname']['S']},
            "artist_id": {'S': object['artist_id']['S']},
            "methods1": {'S': method1},
            "methods2": {'S': method2},
            "image_method2_key": {'S': image_method2_key},
            "object_image": {'S': object['object_image']['S']},
            "image_file_key": {'S': object['image_file_key']['S']},
            "year": {'S': object['year']['S']},
            "title": {'S': object['title']['S']},
        })

        today = datetime.date.today().strftime("%m/%d/%Y")
        action = transaction_object['action']['S']
        print("add => id_transaction",
              transaction_object['id_transaction']['S'])
        print("add => methods1", method1)
        print("add => methods2", method2)

        if len(method1) > 0 or len(method2) > 0:
            action = 'onboard'

        print("add => action", action)

        client.put_item(TableName=PROTOV_TRANSACTION_TABLE, Item={
            "id_transaction": {'S': transaction_object['id_transaction']['S']},
            "id_object": {'S': id_object},
            "action": {'S': action},
            "date": {'S': today},
            "methods1": {'S': method1},
            "methods2": {'S': method2},
            "owner_id": {'S': transaction_object['owner_id']['S']},
        })

        return jsonify(message={"add_method_success": True})
    return jsonify(message={"add_method_success": False})
