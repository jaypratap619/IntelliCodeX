from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from dotenv import load_dotenv
import pymysql
import os


jwt = JWTManager()
bcrypt = Bcrypt()

def create_app():
    load_dotenv()
    app = Flask(__name__)
    app.config.from_object("app.config.Config")

    CORS(app)
    jwt.init_app(app)
    bcrypt.init_app(app)

    from app.routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    return app

