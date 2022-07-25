import os
import json
import datetime
from uuid import uuid4
import botocore
import boto3
from boto3.dynamodb.conditions import Key

from flask import Blueprint, jsonify, request
from services.aws_object import get_objects
from services.aws_transaction import AwsTransactionService
import schemas


TRANSACTION_TABLE = os.environ.get("STORAGE_DYNAMODBTRANSACTION_NAME")
OBJECT_PROTOV_TABLE = os.environ.get("STORAGE_DYNAMODB_NAME")

aws_transaction_blueprint = Blueprint("transaction", __name__)

clientTransaction = boto3.client('dynamodb')


@aws_transaction_blueprint.route('/transactionobject/<id_object>', methods=["GET"])
def get_transaction(id_object: str) -> schemas.TransactResponse:
    objects = AwsTransactionService.get_transaction_objects()
    objects_data = []

    for obj in objects['Items']:
        print("get_transaction: obj => ", obj)
        if obj['id_object']['S'] == id_object:
            objects_data.append(obj)
    print("get_transaction: objects_data => ", objects_data)
    if len(objects_data) > 0:
        objects_data = [{
            'owner_id': obj['owner_id']['S'],
            'new_owner_id': obj['new_owner_id']['S'],
            'date': obj['date']['S'],
            'action': obj['action']['S'],
            'verification_methods': {
                'methods1': obj['methods1']['S'],
                'methods2': obj['methods2']['S'],
            }
        } for obj in objects_data]
        objects_data = sorted(
            objects_data, key=lambda row: row['date'])
    return jsonify(data=objects_data)


@aws_transaction_blueprint.route('/transactionobject/sale', methods=["POST"])
def sale() -> schemas.SaleResponse:
    request_json: schemas.SaleRequest = request.get_json()
    id_object = request_json.get('id_object')
    owner_id = request_json.get('owner_password')
    new_owner_id = request_json.get('new_owner_id')
    methods1 = request_json.get('methods1')
    methods2 = request_json.get('methods2')

    objects = get_objects(clientTransaction)
    objects_transaction = AwsTransactionService.get_transaction_objects()

    object = None
    for obj in objects['Items']:
        if obj['id_object']['S'] == id_object:
            object = obj

    verify_object = None
    for obj in objects_transaction['Items']:
        n_owner_id = obj['new_owner_id']['S']
        print("sale: n_owner_id ", n_owner_id)
        if n_owner_id == owner_id and obj['id_object']['S'] == id_object:
            verify_object = obj
        if obj['owner_id']['S'] == owner_id and obj['id_object']['S'] == id_object:
            verify_object = obj

    if object and verify_object and object['id_object']['S'] == verify_object['id_object']['S']:
        today = datetime.datetime.today().strftime("%m/%d/%Y, %H:%M:%S")
        action = "transfer"
        transfer_transaction = str(uuid4())

        clientTransaction.put_item(TableName=TRANSACTION_TABLE, Item={
            "id_transaction": {'S': transfer_transaction},
            "id_object": {'S': verify_object['id_object']['S']},
            "action": {'S': action},
            "date": {'S': today},
            "methods1": {'S': methods1 if methods1 else ""},
            "methods2": {'S': methods2 if methods2 else ""},
            "owner_id": {'S': verify_object['owner_id']['S']},
            "new_owner_id": {'S': new_owner_id},
        })

        return {"owner_ver_status": True}
    else:
        return {"owner_ver_status": False}


@aws_transaction_blueprint.route('/transactionobject/add_method', methods=['POST'])
def add_method() -> schemas.AddMethodResponse:
    request_json: schemas.AddMethodRequest = request.get_json()
    artist_id = request_json.get("artist_id")
    id_object = request_json.get("id_object")
    methods1 = request_json.get("methods1")
    methods2 = request_json.get("methods2")
    image_method2_key = request_json.get("image_method2_key")

    objects = get_objects(clientTransaction)
    transaction_objects = AwsTransactionService.get_transaction_objects()

    modify_objects_transaction = []
    if len(transaction_objects) > 0:
        for obj in transaction_objects['Items']:
            for key, value in obj.items():
                obj[key] = value["S"]

            modify_objects_transaction.append(obj)

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
        clientTransaction.put_item(TableName=OBJECT_PROTOV_TABLE, Item={
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
        if len(methods1) > 0 or len(methods2) > 0:
            action = 'added'
        id_transaction = str(uuid4())
        clientTransaction.put_item(TableName=TRANSACTION_TABLE, Item={
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


# bccb211ecb9341f7a954bf218257e823
