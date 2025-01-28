API_USER='http://127.0.0.1:5000/usuario'

from flask import Flask, request, jsonify
from flask_cors import CORS
from db import get_connection

# Usa o nome do módulo para configurar a raiz do projeto.
app = Flask(__name__)
# Permite que navegadores realizem requisições para o back-end Flask mesmo se estiverem hospedados em domínios ou portas diferentes.
CORS(app)



# Criar usuário
# vai ter uma route e um method
@app.route('/usuario', methods=['POST'])
def create_user():
    # O data esta vindo do javascript json
    data = request.json
    # todos vão ter um conn e cursor
    conn = get_connection()
    cursor = conn.cursor()

    # Vai usar o json cuja key são os IDs
    cursor.execute("INSERT INTO usuario (nome, senha) VALUES (%s, %s)", 
                   (data['nome'], data['senha']))
    conn.commit()
    return jsonify({"message": "User created successfully"}), 201





# Listar usuários
@app.route('/usuario', methods=['GET'])
def get_users():
    conn = get_connection()
    #  vai buscar como dicionario
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM usuario")

    # Ele vai buscar todos como fetchall
    users = cursor.fetchall()
    print(users)
    return jsonify(users), 200

# Atualizar usuário
@app.route('/usuario/<int:id>', methods=['PUT'])
def update_user(id):
    data = request.json
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE usuario SET nome=%s, senha=%s, WHERE id=%s", 
                   (data['nome'], data['senha'], id))
    conn.commit()
    return jsonify({"message": "User updated successfully"}), 200

# Deletar usuário
@app.route('/usuario/<int:id>', methods=['DELETE'])
def delete_user(id):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM usuario WHERE id=%s", (id,))
    conn.commit()
    return jsonify({"message": "User deleted successfully"}), 200








if __name__ == '__main__':
    app.run(debug=True)


