import os
from uuid import uuid4
import json
import botocore
import boto3
from flask import jsonify
import schemas

PROTOV_TABLE = os.environ.get("STORAGE_DYNAMODB_NAME")
client = boto3.client('dynamodb')


class AwsObjectService:
    def create_aws_object(client, request_json: schemas.AddObject) -> schemas.CreateObjectResponse:
        name = request_json.get('artist_firstname')
        surname = request_json.get('artist_surname')
        title = request_json.get('title')
        year = request_json.get('year')

        id_object = str(uuid4())
        artist_id = uuid4().hex

        objects = get_objects()

        if len(objects['Items']) > 0:
            for obj in objects['Items']:
                if obj['artist_firstname']['S'] == name and obj['artist_surname']['S'] == surname:
                    artist_id = obj['artist_id']['S']
                # if obj['title']['S'] == title and obj['year']['S'] == year and obj['artist_surname']['S'] == surname:
                #     id_object = obj['id_object']['S']
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
                "add_object_success": 'true',
            }
        except botocore.exceptions.ClientError as error:
            return jsonify(message={"add_object_success": 'false'})

    @staticmethod
    def get_object_info(object, search_item):
        return {
            'search_item': search_item,
            'artist_firstname': object['artist_firstname']['S'],
            'artist_id': object['artist_id']['S'],
            'artist_surname': object['artist_surname']['S'],
            'id_object': object['id_object']['S'],
            'image_file_key': object['image_file_key']['S'],
            'image_method2_key': object['image_method2_key']['S'],
            'methods1': object['methods1']['S'],
            'methods2': object['methods2']['S'],
            'object_image': object['object_image']['S'],
            'title': object['title']['S'],
            'year': object['year']['S'],
        }


def get_objects():
    data_objects = client.scan(TableName=PROTOV_TABLE)
    data = json.dumps(data_objects)
    objects = json.loads(data)
    return objects
