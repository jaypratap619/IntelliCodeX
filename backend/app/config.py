import os

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "default-secret")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt-secret")
