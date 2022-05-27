import os
from uuid import uuid4
import datetime
import botocore
from flask import jsonify

TRANSACTION_TABLE = os.environ.get("STORAGE_DYNAMODBTRANSACTION_NAME")


class AwsTransactionService:
    def create_transaction(client, request_json, owner_id, id_object):
        id_transaction = str(uuid4())
        today = datetime.date.today().strftime("%m/%d/%Y")
        print("create_transaction: today", today)
        try:
            client.put_item(TableName=TRANSACTION_TABLE, Item={
                "id_transaction": {'S': id_transaction},
                "id_object": {'S': id_object},
                "action": {'S': 'onboard'},
                "date": {'S': today},
                "methods1": {'S': request_json.get('methods1')},
                "methods2": {'S': request_json.get('methods2')},
                "owner_id": {'S': owner_id},
            })
            return jsonify(message="create_transaction: object created")

        except botocore.exceptions.ClientError as error:
            return jsonify(message={"add_object_success": 'false'})
            # if error.response['Error']['Code'] == 'LimitExceededException':
            #     logger.warn(
            #         'create_transaction: API call limit exceeded; backing off and retrying...')
            #     return jsonify(message="create_transaction: object didn't create")
            # else:
            #     print("create_transaction: error => ", error)
