import os
from uuid import uuid4
import json
import boto3
from boto3.dynamodb.conditions import Key

from flask import Blueprint, jsonify, request

BASE_ROUTE = "/"

PROTOV_TABLE = os.environ.get("STORAGE_DYNAMODB_NAME")

aws_object_blueprint = Blueprint(BASE_ROUTE, __name__)

client = boto3.client('dynamodb')


@aws_object_blueprint.route(BASE_ROUTE + 'protovobject', methods=["POST"])
def create_object():
    request_json = request.get_json()
    id_object = str(uuid4())
    client.put_item(TableName=PROTOV_TABLE, Item={
        "id_object": {'S': id_object},
        "artist_surname": {'S': request_json.get('artist_surname')},
        "artist_firstname": {'S': request_json.get('artist_firstname')},
        "methods1": {'S': request_json.get('methods1')},
        "methods2": {'S': request_json.get('methods2')},
        "image_method2_key": {'S': request_json.get('image_method2_key')},
        "artist_id": {'S': request_json.get('artist_id')},
        "object_image": {'S': request_json.get('object_image')},
        "image_file_key": {'S': request_json.get('image_file_key')},
        "year": {'S': request_json.get('year')},
        "title": {'S': request_json.get('title')},

    })

    return jsonify(message={
        "add_object_success": 'true',
        "artist_surname": request_json.get('artist_surname'),
        "artist_firstname": request_json.get('artist_firstname'),
        "id_object": id_object,
        "object": request_json.get('object_image'),
        "year": request_json.get('year'),
        "title": request_json.get('title'),
        "methods1": request_json.get('methods1'),
        "methods2": request_json.get('methods2'),
    })


@aws_object_blueprint.route(BASE_ROUTE + 'protovobject', methods=["GET"])
def list_objects():
    return jsonify(data=client.scan(TableName=PROTOV_TABLE))


@aws_object_blueprint.route(BASE_ROUTE + 'protovobject/objects', methods=['POST'])
def get_object():
    request_json = request.get_json()

    id_object = request_json.get('object_id')
    surname = request_json.get('artist_surname')
    name = request_json.get('artist_firstname')
    title = request_json.get('title')
    year = request_json.get('year')

    data_objects = client.scan(TableName=PROTOV_TABLE)
    data = json.dumps(data_objects)
    objects = json.loads(data)

    objects_data = []

    for obj in objects['Items']:
        if obj['artist_firstname']['S'] == name and obj['artist_surname']['S'] == surname:
            objects_data.append(obj)
        if obj['id_object']['S'] == id_object:
            objects_data.append(obj)
        if obj['title']['S'] == title and obj['year']['S'] == year:
            objects_data.append(obj)

    print("get_object: objects_data => ", objects_data)
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


@aws_object_blueprint.route(BASE_ROUTE + 'protovobject/<object_id>', methods=["GET"])
def verify_object(object_id):
    data_objects = client.scan(TableName=PROTOV_TABLE)
    data = json.dumps(data_objects)
    objects = json.loads(data)

    print("verify_object: object_id => ", object_id)

    print("verify_object: objects['Items'] => ", objects['Items'])

    objects_data = []

    for obj in objects['Items']:
        print("verify_object: obj => ", obj)
        if obj['id_object']['S'] == object_id:
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


@aws_object_blueprint.route(BASE_ROUTE + 'protovobject/<id_object>', methods=['DELETE'])
def delete_object(id_object):
    client.delete_item(
        TableName=PROTOV_TABLE,
        Key={'id_object': {'S': id_object}})
    return jsonify(message='object deleted')


@aws_object_blueprint.route(BASE_ROUTE + '/<id_object>', methods=['PUT'])
def update_object(id_object):
    client.update_item(
        TableName=PROTOV_TABLE,
        Key={'id_object': {'S': id_object}},
        UpdateExpression='SET ' +
        '#artist_surname = :artist_surname, ' +
        '#artist_firstname = :artist_firstname, ' +
        '#artist_id = :artist_id, ' +
        '#methods1 = :methods1, ' +
        '#methods2 = :methods2, ' +
        '#object_image = :object_image, ' +
        '#title = :title, ' +
        '#year = :year, ' +
        '#image_method2_key = :image_method2_key ,' +
        '#image_file_key = :image_file_key',
        ExpressionAttributeNames={
            '#artist_surname': 'artist_surname',
            '#artist_firstname': 'artist_firstname',
            '#artist_id': 'artist_id',
            '#methods1': 'methods1',
            '#methods2': 'methods2',
            '#object_image': 'object_image',
            '#title': 'title',
            '#year': 'year',
            '#image_method2_key': 'image_method2_key',
            '#image_file_key': 'image_file_key',
        },
        ExpressionAttributeValues={
            ':artist_surname': {'S': request.json['artist_surname']},
            ':artist_firstname': {'S': request.json['artist_firstname']},
            ':artist_id': {'S': request.json['artist_id']},
            ':methods1': {'S': request.json['methods1']},
            ':methods2': {'S': request.json['methods2']},
            ':object_image': {'S': request.json['object_image']},
            ':title': {'S': request.json['title']},
            ':year': {'S': str(request.json['year'])},
            ':image_method2_key': {'S': str(request.json['image_method2_key'])},
            ':image_file_key': {'S': str(request.json['image_file_key'])},
        }
    )
    return jsonify(message='object update')
