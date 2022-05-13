import os
import json
from uuid import uuid4
import botocore
import boto3
import logging

from flask import Blueprint, jsonify, request

# Set up our logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger()

TRANSACTION_TABLE = os.environ.get("STORAGE_DYNAMODBTRANSACTION_NAME")

aws_transaction_blueprint = Blueprint("transaction", __name__)

clientTransaction = boto3.client('dynamodb')


@aws_transaction_blueprint.route('/transactionobject', methods=["POST"])
def create_transaction():
    request_json = request.get_json()
    id_transaction = str(uuid4())
    try:
        clientTransaction.put_item(TableName=TRANSACTION_TABLE, Item={
            "id_transaction": {'S': id_transaction},
            "id_object": {'S': request_json.get('id_object')},
            "action": {'S': request_json.get('action')},
            "date": {'S': request_json.get('date')},
            "methods1": {'S': request_json.get('methods1')},
            "methods2": {'S': request_json.get('methods2')},
            "owner_id": {'S': request_json.get('owner_id')},
        })
        logger.info('create_transaction: object created')
        return jsonify(message="create_transaction: object created")

    except botocore.exceptions.ClientError as error:
        if error.response['Error']['Code'] == 'LimitExceededException':
            logger.warn(
                'create_transaction: API call limit exceeded; backing off and retrying...')
        else:
            raise error


@aws_transaction_blueprint.route('/transactionobject/<object_id>', methods=["GET"])
def get_transaction(object_id):
    data_objects = clientTransaction.scan(TableName=TRANSACTION_TABLE)
    data = json.dumps(data_objects)
    objects = json.loads(data)

    print("get_transaction: object_id => ", object_id)

    print("get_transaction: objects['Items'] => ", objects['Items'])

    objects_data = []

    for obj in objects['Items']:
        print("get_transaction: obj => ", obj)
        if obj['id_object']['S'] == object_id:
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


@aws_transaction_blueprint.route('/transactionobject/verify_owner', methods=["POST"])
def verify_owner():
    request_json = request.get_json()
    id_object = request_json.get('object_id')
    password = request_json.get('owner_password')
    print("verify_owner: id_object ", id_object)
    # TODO: you need create logic of log in to get the owner password for verification owner
    return {
        'id_object': id_object,
        'password': password,
    }
