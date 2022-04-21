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


def handler(event, context):
    return awsgi.response(app, event, context)
