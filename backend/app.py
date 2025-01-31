from flask import Flask, request, jsonify
from flask_cors import CORS
app = Flask(__name__)
CORS(app)  # Habilita CORS para todas as rotas
from db import get_connection


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



# inserir Usuario

@app.route('/profissional', methods=['POST'])
def inserir_usuario():
    data = request.json
    nome = data.get('nome')
    senha = data.get('senha')
    celular = data.get('celular')
    email = data.get('email')
    adm = data.get('adm')
    

    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        cursor.callproc('InserirUsuarioProfissionalContato', (nome, senha, celular, email, adm))
        conn.commit()
        
        cursor.close()
        conn.close()
        
        return jsonify({"message": "Usuário, profissional e contato inseridos com sucesso!"}), 200
    except Exception as e:
        return jsonify({"error inserir usuario": str(e)}), 500


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)





    