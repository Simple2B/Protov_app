import os


def create_app():

    from flask import Flask
    from flask_cors import CORS

    from views.aws_object import (
        aws_object_blueprint,
    )
    # Instantiate app.
    app = Flask(__name__)

    # Set up extensions.
    CORS(app)

    # Register blueprints.
    app.register_blueprint(aws_object_blueprint)

    return app
