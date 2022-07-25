import os
import json
from uuid import uuid4
import datetime
import boto3
import botocore
from flask import jsonify
from typing import Union
import schemas

TRANSACTION_TABLE = os.environ.get("STORAGE_DYNAMODBTRANSACTION_NAME")
clientTransaction = boto3.client('dynamodb')


class AwsTransactionService:
    def create_transaction(client, transaction_data: schemas.CreateTransaction) -> Union[schemas.CreateTransactionResponse, schemas.CreateObjectResponse]:
        id_transaction = str(uuid4())
        today = datetime.datetime.today().strftime("%m/%d/%Y, %H:%M:%S")
        print("create_transaction: today", today)

        action = 'add method'

        is_transaction = len(transaction_data['methods1']) > 0 or len(
            transaction_data['methods2'])

        print("create_transaction: is_transaction", is_transaction)

        if is_transaction:
            action = 'onboard'

        print("create_transaction: action", action)

        try:
            client.put_item(TableName=TRANSACTION_TABLE, Item={
                "id_transaction": {'S': id_transaction},
                "id_object": {'S': transaction_data["id_object"]},
                "action": {'S': action},
                "date": {'S': today},
                "methods1": {'S': transaction_data['methods1']},
                "methods2": {'S': transaction_data['methods2']},
                "owner_id": {'S': transaction_data["owner_id"]},
                "new_owner_id": {'S': ""},
            })
            return jsonify(message="create_transaction: object created")

        except botocore.exceptions.ClientError as error:
            return jsonify(message={"add_object_success": 'false'})

    @staticmethod
    def get_transaction_objects():
        data_objects = clientTransaction.scan(TableName=TRANSACTION_TABLE)
        data = json.dumps(data_objects)
        objects = json.loads(data)
        return objects
