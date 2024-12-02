import mysql.connector
from dotenv import load_dotenv
import os

# Carrega um arquivo env 
load_dotenv()

def get_connection():
    return mysql.connector.connect(

        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME")
    )

if __name__=='__main__':
    print(os.getenv("DB_USER"))
    host = mysql.connector.connect(host=os.getenv("DB_HOST"))
    user = mysql.connector.connect(user=os.getenv("DB_USER"))
    password = mysql.connector.connect(password=os.getenv("DB_PASSWORD"))
    database = mysql.connector.connect(database=os.getenv("DB_NAME"))