import os
import json
from uuid import uuid4
import datetime
import botocore
import boto3
from boto3.dynamodb.conditions import Key
import logging

from flask import Blueprint, jsonify, request
from services.aws_object import AwsObjectService

from services.aws_transaction import AwsTransactionService

# Set up our logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger()

TRANSACTION_TABLE = os.environ.get("STORAGE_DYNAMODBTRANSACTION_NAME")
OBJECT_PROTOV_TABLE = os.environ.get("STORAGE_DYNAMODB_NAME")

aws_transaction_blueprint = Blueprint("transaction", __name__)

clientTransaction = boto3.client('dynamodb')


@aws_transaction_blueprint.route('/transactionobject/<id_object>', methods=["GET"])
def get_transaction(id_object):
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
            'date': obj['date']['S'],
            'action': obj['action']['S'],
            'verification_methods': {
                'method1': obj['methods1']['S'],
                'method2': obj['methods2']['S'],
            }
        } for obj in objects_data]
    return jsonify(data=objects_data)


@aws_transaction_blueprint.route('/transactionobject/sale', methods=["POST"])
def sale():
    request_json = request.get_json()
    id_object = request_json.get('id_object')

    owner_id = request_json.get('owner_password')

    new_owner_id = request_json.get('new_owner_id')
    print("sale: new_owner_id ==>>>", new_owner_id)

    # data_objects = clientTransaction.scan(TableName=OBJECT_PROTOV_TABLE)
    # data = json.dumps(data_objects)
    objects = AwsObjectService.get_objects()

    # data_transaction_objects = clientTransaction.scan(
    #     TableName=TRANSACTION_TABLE)
    # data_transaction = json.dumps(data_transaction_objects)
    objects_transaction = AwsTransactionService.get_transaction_objects()

    object = None
    for obj in objects['Items']:
        if obj['id_object']['S'] == id_object:
            object = obj

    verify_object = None
    for obj in objects_transaction['Items']:
        if obj['owner_id']['S'] == owner_id and obj['id_object']['S'] == id_object:
            verify_object = obj

    if object['id_object']['S'] == verify_object['id_object']['S']:
        today = datetime.date.today().strftime("%m/%d/%Y")
        print("new_owner_id ", new_owner_id)
        update_password = clientTransaction.update_item(
            TableName=TRANSACTION_TABLE,
            Key={'id_transaction': {
                'S': verify_object['id_transaction']['S']}},
            UpdateExpression='SET ' +
            "#id_object = :id_object, " +
            "#action = :action, " +
            "#date = :date," +
            "#methods1 = :methods1, " +
            "#methods2 = :methods2, " +
            "#owner_id = :owner_id",
            ExpressionAttributeNames={
                "#id_object": "id_object",
                "#action": "action",
                "#date": "date",
                "#methods1": "methods1",
                "#methods2": "methods2",
                "#owner_id": "owner_id",
            },
            ExpressionAttributeValues={
                ":id_object": {'S': verify_object['id_object']['S']},
                ":action": {'S': verify_object['action']['S']},
                ":date": {'S': today},
                ":methods1": {'S': verify_object['methods1']['S']},
                ":methods2": {'S': verify_object['methods2']['S']},
                ":owner_id": {'S': new_owner_id},
            }
        )

        print("update_password ", update_password)

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
