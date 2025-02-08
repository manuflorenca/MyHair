import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
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
    print(data)
    conn = get_connection()
    cursor = conn.cursor()
   
    # cursor.execute("INSERT INTO agenda (ID_C, ID_S, ID_P, Status, Hora, Dati) VALUES (%s, %s, %s, %s, %s, %s)",
    #                (data['ID_C'], data['ID_S'], data['ID_P'], data['Status'], data['Hora'], data['Dati']))
    
    cursor.execute("CALL AgendarServicoPorNome(%s,%s,%s,%s,%s)",
                   (data['nome_cliente'], data['nome_profissional'], data['nome_servico'], data['Hora'], data['Dati']))
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
 
 
 
# @app.route('/profissional', methods=['GET'])
# def get_profissionais():
#     conn = get_connection()
#     cursor = conn.cursor(dictionary=True)
#     cursor.execute("SELECT ID, ID_U FROM profissional")  # Seleciona apenas id e nome
#     profissionais = cursor.fetchall()
#     return jsonify(profissionais), 200
 
@app.route('/profissional', methods=['GET'])
def get_profissionais():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
 
    try:
        # Chama a procedure para obter os nomes dos profissionais
        cursor.callproc('ObterNomesProfissionais')
       
        profissionais = []
       
        # Obtém o resultado da procedure
        for result in cursor.stored_results():
            profissionais = result.fetchall()
 
        return jsonify(profissionais), 200
 
    except Exception as err:
        return jsonify({'error conection': str(err)}), 500
 
    finally:
        cursor.close()
        conn.close()

import logging

import logging
from flask import jsonify

@app.route('/selectAdmin/<int:user_id>', methods=['GET'])
def get_adm(user_id):
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        # Chame o procedimento armazenado usando execute
        cursor.execute("CALL GetAdmByUserId(%s)", (user_id,))
        result = cursor.fetchone()

        if result:
            return jsonify({'Adm': result['Adm']}), 200  # Acesse pelo nome da coluna
        else:
            return jsonify({'error': 'Usuário não encontrado ou sem profissional associado.'}), 404

    except Exception as e:
        logging.error(f"Erro ao buscar Adm para o usuário {user_id}: {str(e)}")
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()  # Certifique-se de fechar a conexão
 
@app.route('/datahora', methods=['GET'])
def get_data_hora():
    # Obtém a data e hora atual
    agora = datetime.now()
    data_hora = agora.strftime("%Y-%m-%d %H:%M:%S")  # Formato: YYYY-MM-DD HH:MM:SS
    return jsonify({"data_hora": data_hora})

if __name__ == '__main__':
    app.run( debug=True)
 
 
 
 
 
   
 