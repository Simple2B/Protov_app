from email import message
import os
from uuid import uuid4
import json
import botocore
from flask import jsonify

PROTOV_TABLE = os.environ.get("STORAGE_DYNAMODB_NAME")


class AwsObjectService:
    def create_aws_object(client, request_json):
        name = request_json.get('artist_firstname')
        surname = request_json.get('artist_surname')
        title = request_json.get('title')
        year = request_json.get('year')

        id_object = str(uuid4())
        artist_id = uuid4().hex

        data_objects = client.scan(TableName=PROTOV_TABLE)
        data = json.dumps(data_objects)
        objects = json.loads(data)
        print("AwsObjectService => create_object: objects ", objects)
        if len(objects['Items']) > 0:
            for obj in objects['Items']:
                if obj['artist_firstname']['S'] == name.strip() and obj['artist_surname']['S'] == surname.strip():
                    artist_id = obj['artist_id']['S']
                if obj['title']['S'] == title and obj['year']['S'] == year:
                    id_object = obj['id_object']['S']
        try:
            client.put_item(TableName=PROTOV_TABLE, Item={
                "id_object": {'S': id_object},
                "artist_surname": {'S': surname},
                "artist_firstname": {'S': name},
                "artist_id": {'S': artist_id},
                "methods1": {'S': request_json.get('methods1')},
                "methods2": {'S': request_json.get('methods2')},
                "image_method2_key": {'S': request_json.get('image_method2_key')},
                "object_image": {'S': request_json.get('object_image')},
                "image_file_key": {'S': request_json.get('image_file_key')},
                "year": {'S': year},
                "title": {'S': title},
            })

            return {
                "artist_surname": surname,
                "artist_firstname": name,
                "artist_id": str(artist_id),
                "id_object": id_object,
                "object": request_json.get('object_image'),
                "year": request_json.get('year'),
                "title": request_json.get('title'),
                "methods1": request_json.get('methods1'),
                "methods2": request_json.get('methods2'),
            }
        except botocore.exceptions.ClientError as error:
            return jsonify(message={"add_object_success": 'false'})