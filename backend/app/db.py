import pymysql
import os
from dotenv import load_dotenv

load_dotenv()  # Load .env variables

def get_db_connection():
    connection = pymysql.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
        port=int(os.getenv("DB_PORT", 3306)),
        # To be read
        cursorclass=pymysql.cursors.DictCursor,
        autocommit=True
    )
    return connection
