const API_URL_datahora = 'http://127.0.0.1:5000/datahora'; // URL do seu endpoint

async function obterDataHora() {
    try {
        const response = await fetch(API_URL_datahora);
        if (!response.ok) {
            throw new Error('Erro ao acessar a API');
        }
        const dataHora = await response.json();
        console.log("Data e Hora Atual:", dataHora.data_hora);
        // Aqui você pode atualizar a interface do usuário com a data e hora
    } catch (error) {
        console.error('Erro:', error);
    }
}

// Chama a função para obter a data e hora
obterDataHora();