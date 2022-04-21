from ast import Expression
from crypt import methods
import awsgi
import boto3
import os

from flask_cors import CORS
from flask import Flask, jsonify, request
from uuid import uuid4


BASE_ROUTE = "/awsobject"
TABLE_PROTOV_OBJECT = os.environ.get("STORAGE_PROTOVDB_NAME")

client = boto3.client('dynamodb')
app = Flask(__name__)
CORS(app)


@app.route(BASE_ROUTE, methods=["POST"])
def create_object():
    request_json = request.get_json()
    client.put_item(TableName=TABLE_PROTOV_OBJECT, Item={
        "id_object": {'S': str(uuid4())},
        "artist_surname": {'S': request_json.get('artist_surname')},
        "artist_firstname": {'S': request_json.get('artist_firstname')},
        "artist_id": {'S': request_json.get('artist_id')},
        "object_image": {'S': request_json.get('object_image')},
        "title": {'S': request_json.get('title')},
        "year": {'S': request_json.get('title')}
    })
    return jsonify(message='aws object created')


@app.route(BASE_ROUTE, methods=["GET"])
def list_objects():
    return jsonify(data=client.scan(TableName=TABLE_PROTOV_OBJECT))


@app.route(BASE_ROUTE + '/<id_object>', methods=['GET'])
def get_object(id_object):
    object = client.get_item(
        TableName=TABLE_PROTOV_OBJECT,
        Key={'id_object': {'S': id_object}})
    return jsonify(data=object)


@app.route(BASE_ROUTE + '/<id_object>', methods=['DELETE'])
def delete_object(id_object):
    client.delete_item(
        TableName=TABLE_PROTOV_OBJECT,
        Key={'id_object': {'S': id_object}})
    return jsonify(message='object deleted')


@app.route(BASE_ROUTE + '/<id_object>', methods=['PUT'])
def update_object(id_object):
    client.update_item(
        TableName=TABLE_PROTOV_OBJECT,
        Key={'id_object': {'S': id_object}},
        UpdateExpression='SET ' +
        '#artist_surname = :artist_surname, ' +
        '#artist_firstname = :artist_firstname, ' +
        '#artist_id = :artist_id, ' +
        '#object_image = :object_image, ' +
        '#title = :title, ' +
        '#year = :year',
        ExpressionAttributeNames={
            '#artist_surname': 'artist_surname',
            '#artist_firstname': 'artist_firstname',
            '#artist_id': 'artist_id',
            '#object_image': 'object_image',
            '#title': 'title',
            '#year': 'year',
        },
        ExpressionAttributeValues={
            ':artist_surname': {'S': request.json['artist_surname']},
            ':artist_firstname': {'S': request.json['artist_firstname']},
            ':artist_id': {'S': request.json['artist_id']},
            ':object_image': {'S': request.json['object_image']},
            ':title': {'S': request.json['title']},
            ':year': {'S': str(request.json['year'])},
        }
    )
    return jsonify(message='object update')


def handler(event, context):
    return awsgi.response(app, event, context)
