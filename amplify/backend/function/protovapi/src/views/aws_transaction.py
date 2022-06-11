import os
import json
from uuid import uuid4
import datetime
import botocore
import boto3
from boto3.dynamodb.conditions import Key
import logging

from flask import Blueprint, jsonify, request
from services.aws_object import AwsObjectService, get_objects

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
            'new_owner_id': obj['new_owner_id']['S'],
            'date': obj['date']['S'],
            'action': obj['action']['S'],
            'verification_methods': {
                'methods1': obj['methods1']['S'],
                'methods2': obj['methods2']['S'],
            }
        } for obj in objects_data]
    return jsonify(data=objects_data)


@aws_transaction_blueprint.route('/transactionobject/sale', methods=["POST"])
def sale():
    request_json = request.get_json()
    id_object = request_json.get('id_object')
    owner_id = request_json.get('owner_password')
    new_owner_id = request_json.get('new_owner_id')
    objects = get_objects()
    objects_transaction = AwsTransactionService.get_transaction_objects()

    object = None
    for obj in objects['Items']:
        if obj['id_object']['S'] == id_object:
            object = obj
# cdbf60fa33164c5a8dfbe59f651a91c9
    verify_object = None
    for obj in objects_transaction['Items']:
        n_owner_id = obj['new_owner_id']['S']
        print("sale: n_owner_id ", n_owner_id)
        if n_owner_id != "":
            if n_owner_id == owner_id and obj['id_object']['S'] == id_object:
                verify_object = obj
        if obj['owner_id']['S'] == owner_id and obj['id_object']['S'] == id_object:
            verify_object = obj

    if object and verify_object and object['id_object']['S'] == verify_object['id_object']['S']:
        today = datetime.datetime.today().strftime("%m/%d/%Y, %H:%M:%S")
        print("new_owner_id ", new_owner_id)

        action = "transfer"
        transfer_transaction = str(uuid4())

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
            "#owner_id = :owner_id, " +
            "#new_owner_id = :new_owner_id",
            ExpressionAttributeNames={
                "#id_object": "id_object",
                "#action": "action",
                "#date": "date",
                "#methods1": "methods1",
                "#methods2": "methods2",
                "#owner_id": "owner_id",
                "#new_owner_id": "new_owner_id",
            },
            ExpressionAttributeValues={
                ":id_object": {'S': verify_object['id_object']['S']},
                ":action": {'S': verify_object['action']['S']},
                ":date": {'S': verify_object['date']['S']},
                ":methods1": {'S': verify_object['methods1']['S']},
                ":methods2": {'S': verify_object['methods2']['S']},
                ":owner_id": {'S': verify_object['owner_id']['S']},
                ":new_owner_id": {'S': new_owner_id},

            }
        )

        print("update_password ", update_password)

        clientTransaction.put_item(TableName=TRANSACTION_TABLE, Item={
            "id_transaction": {'S': transfer_transaction},
            "id_object": {'S': verify_object['id_object']['S']},
            "action": {'S': action},
            "date": {'S': today},
            "methods1": {'S': verify_object['methods1']['S']},
            "methods2": {'S': verify_object['methods2']['S']},
            "owner_id": {'S': verify_object['owner_id']['S']},
            "new_owner_id": {'S': new_owner_id},
        })
        print("update_password: transfer_transaction ", transfer_transaction)

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
            "owner_id": owner_id,
            "owner_ver_status": False
        }
