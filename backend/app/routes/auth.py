from flask import Blueprint, request, jsonify
from flask_bcrypt import check_password_hash, generate_password_hash
from flask_jwt_extended import create_access_token
from app.db import get_db_connection
import datetime

auth_bp = Blueprint("auth", __name__)

print('auth_bp', auth_bp)

# SIGNUP ROUTE
@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    print("data", data)
    email = data.get("email")
    password = data.get("password")
    username = data.get("username")
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    conn = get_db_connection()
    print("conn", conn)
    with conn.cursor() as cursor:
        # Check if user already exists
        print("cursor", cursor)
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            return jsonify({"error": "User already exists"}), 409

        # Hash the password and insert new user
        hashed_password = generate_password_hash(password).decode("utf-8")
        cursor.execute("INSERT INTO users (email, password, username) VALUES (%s, %s, %s)", (email, hashed_password, username))
        return jsonify({"message": "User created successfully"}), 201


# LOGIN ROUTE
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    conn = get_db_connection()
    with conn.cursor() as cursor:
        cursor.execute("SELECT id, password FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()

        if not user or not check_password_hash(user["password"], password):
            return jsonify({"error": "Invalid credentials"}), 401

        # Create access token (valid for 1 hour)
        expires = datetime.timedelta(hours=1)
        access_token = create_access_token(identity=user["id"], expires_delta=expires)

        return jsonify({"token": access_token, "user_id": user["id"]}), 200
