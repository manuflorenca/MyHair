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


# Criar agendamento
@app.route('/agendamento', methods=['POST'])
def create_agendamento():
    data = request.json
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("INSERT INTO agenda (ID_C, ID_S, ID_P, Status, Hora, Dati) VALUES (%s, %s, %s, %s, %s, %s)", 
                   (data['ID_C'], data['ID_S'], data['ID_P'], data['Status'], data['Hora'], data['Dati']))
    conn.commit()
    cursor.close()
    conn.close()
    
    return jsonify({"message": "Agendamento criado com sucesso!"}), 201

# Listar agendamentos
@app.route('/agendamento', methods=['GET'])
def get_agendamentos():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM agenda")
    agendamentos = cursor.fetchall()
    cursor.close()
    conn.close()
    
    return jsonify(agendamentos), 200

# Atualizar agendamento
@app.route('/agendamento/<int:id>', methods=['PUT'])
def update_agendamento(id):
    data = request.json
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("UPDATE agenda SET ID_C=%s, ID_S=%s, ID_P=%s, Status=%s, Hora=%s, Dati=%s WHERE ID=%s", 
                   (data['ID_C'], data['ID_S'], data['ID_P'], data['Status'], data['Hora'], data['Dati'], id))
    conn.commit()
    cursor.close()
    conn.close()
    
    return jsonify({"message": "Agendamento atualizado com sucesso!"}), 200

# Deletar agendamento
@app.route('/agendamento/<int:id>', methods=['DELETE'])
def delete_agendamento(id):
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("DELETE FROM agenda WHERE ID=%s", (id,))
    conn.commit()
    cursor.close()
    conn.close()
    
    return jsonify({"message": "Agendamento deletado com sucesso!"}), 200


# Listar serviços
@app.route('/servico', methods=['GET'])
def get_servicos():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT ID, Nome_S FROM servico")  # Seleciona apenas id e nome
    servicos = cursor.fetchall()
    return jsonify(servicos), 200

@app.route('/profissional', methods=['GET'])
def get_profissionais():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT ID, ID_U FROM profissional")  # Seleciona apenas id e nome
    profissionais = cursor.fetchall()
    return jsonify(profissionais), 200


if __name__ == '__main__':
    app.run( debug=True)





    