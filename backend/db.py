import mysql.connector
from dotenv import load_dotenv
import os

# Carrega as variáveis do .env
load_dotenv()

def get_connection():
    """Cria e retorna uma conexão com o banco de dados"""
    try:
        conn = mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME")
        )
        return conn
    except mysql.connector.Error as e:
        print(f"Erro ao conectar no banco: {e}")
        return None

# Teste a conexão ao rodar este arquivo diretamente
if __name__ == '__main__':
    conn = get_connection()
    if conn:
        print("Conexão bem-sucedida! ✅")
        conn.close()
    else:
        print("Falha na conexão ❌")
