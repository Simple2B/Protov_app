import awsgi
from index_app import create_app

app = create_app()


def handler(event, context):
    return awsgi.response(app, event, context)
