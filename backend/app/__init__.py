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

    try:
        from app.routes.auth import auth_bp
        app.register_blueprint(auth_bp, url_prefix="/api/auth")
    except ImportError:
        raise RuntimeError("Could not import 'auth_bp' from app.routes.auth")

    try:
        from app.routes.project import project_bp
        app.register_blueprint(project_bp, url_prefix="/api/project")
    except ImportError:
        raise RuntimeError("Could not import 'project_bp' from app.routes.project")

    return app

