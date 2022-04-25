import os
from uuid import uuid4
import boto3

from flask import Blueprint, jsonify, request


ACCESS_KEY = 'AKIA2EPNWLLZQZGH3DG4'
SECRET_ACCESS_KEY = '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'

PROTOV_OBJECT_ROUTE = "/awsobject"
TABLE_PROTOV_OBJECT = os.environ.get("STORAGE_PROTOVDB_NAME")

aws_object_blueprint = Blueprint(PROTOV_OBJECT_ROUTE, __name__)

client = boto3.client('dynamodb')
# s3 = boto3.resource('s3')
s3 = boto3.client('s3', aws_access_key_id=ACCESS_KEY,
                  aws_secret_access_key=SECRET_ACCESS_KEY)

# for bucket in s3.buckets.all():
#     print(bucket.name)

# s3.delete_object(Bucket='protov-bucket',
#                  Key='folder_images/test.py')

for file in os.listdir(path='/Users/varvara/Documents/Protov_app/amplify/backend/function/protovapi/src/views/'):
    print("file =>", file)
    print("s3 =>", s3)
    if '.py' in file:
        upload_file_bucket = 'protov-bucket'
        upload_file_key = 'folder_images/' + str(file)
        s3.upload_file(file, upload_file_bucket, upload_file_key)


@aws_object_blueprint.route(PROTOV_OBJECT_ROUTE, methods=["POST"])
def create_object():
    request_json = request.get_json()
    methods1 = request_json.get('methods1')
    methods2 = request_json.get('methods2')
    client.put_item(TableName=TABLE_PROTOV_OBJECT, Item={
        "id_object": {'S': str(uuid4())},
        "artist_surname": {'S': request_json.get('artist_surname')},
        "artist_firstname": {'S': request_json.get('artist_firstname')},
        "methods1": {'S': methods1},
        "methods2": {'S': methods2},
        "artist_id": {'S': request_json.get('artist_id')},
        "object_image": {'S': request_json.get('object_image')},
        "title": {'S': request_json.get('title')},
        "year": {'S': request_json.get('title')}
    })
    return jsonify(message='aws object created')


# @aws_object_blueprint.route(PROTOV_OBJECT_ROUTE, methods=["GET"])
# def list_objects():
#     return jsonify(data=client.scan(TableName=TABLE_PROTOV_OBJECT))


# @aws_object_blueprint.route(PROTOV_OBJECT_ROUTE + '/<id_object>', methods=['GET'])
# def get_object(id_object):
#     object = client.get_item(
#         TableName=TABLE_PROTOV_OBJECT,
#         Key={'id_object': {'S': id_object}})
#     return jsonify(data=object)


# @aws_object_blueprint.route(PROTOV_OBJECT_ROUTE + '/<id_object>', methods=['DELETE'])
# def delete_object(id_object):
#     client.delete_item(
#         TableName=TABLE_PROTOV_OBJECT,
#         Key={'id_object': {'S': id_object}})
#     return jsonify(message='object deleted')


# @aws_object_blueprint.route(PROTOV_OBJECT_ROUTE + '/<id_object>', methods=['PUT'])
# def update_object(id_object):
#     client.update_item(
#         TableName=TABLE_PROTOV_OBJECT,
#         Key={'id_object': {'S': id_object}},
#         UpdateExpression='SET ' +
#         '#artist_surname = :artist_surname, ' +
#         '#artist_firstname = :artist_firstname, ' +
#         '#artist_id = :artist_id, ' +
#         '#methods1 = :methods1, ' +
#         '#methods2 = :methods2, ' +
#         '#object_image = :object_image, ' +
#         '#title = :title, ' +
#         '#year = :year',
#         ExpressionAttributeNames={
#             '#artist_surname': 'artist_surname',
#             '#artist_firstname': 'artist_firstname',
#             '#artist_id': 'artist_id',
#             '#methods1': 'methods1',
#             '#methods2': 'methods2',
#             '#object_image': 'object_image',
#             '#title': 'title',
#             '#year': 'year',
#         },
#         ExpressionAttributeValues={
#             ':artist_surname': {'S': request.json['artist_surname']},
#             ':artist_firstname': {'S': request.json['artist_firstname']},
#             ':artist_id': {'S': request.json['artist_id']},
#             ':methods1': {'S': request.json['methods1']},
#             ':methods2': {'S': request.json['methods2']},
#             ':object_image': {'S': request.json['object_image']},
#             ':title': {'S': request.json['title']},
#             ':year': {'S': str(request.json['year'])},
#         }
#     )
#     return jsonify(message='object update')
