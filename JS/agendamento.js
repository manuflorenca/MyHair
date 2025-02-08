// // script.js
// document.getElementById('mostrarData').addEventListener('click', function() {
//     const dataSelecionada = document.getElementById('data').value;
//     const resultado = document.getElementById('resultado');
    
//     if (dataSelecionada) {
//       resultado.textContent = `Você selecionou a data: ${dataSelecionada}`;
//     } else {
//       resultado.textContent = 'Por favor, selecione uma data.';
//     }
//   });

const API_URL = 'http://127.0.0.1:5000/agendamento'; // URL da sua API
const BtnConfirmarAgendamento = document.getElementById('btn_confirmar');
const BtnData = document.getElementById('data');
const BtnHora = document.getElementById('hora');

// Função para listar agendamentos
// async function listarAgendamentos() {
//     try {
//         const response = await fetch(API_URL);
//         if (!response.ok) {
//             throw new Error('Erro ao acessar a API');
//         }
//         const agendamentos = await response.json();
//         const tabelaBody = document.querySelector('#tabela-agenda tbody');
//         tabelaBody.innerHTML = ''; // Limpa a tabela antes de adicionar

//         agendamentos.forEach(agendamento => {
//             const tr = document.createElement('tr');
//             tr.innerHTML = `
//                 <th scope="row">${agendamento.ID}</th>
//                 <td>${agendamento.ID_S}</td>
//                 <td>${agendamento.ID_P}</td>
//                 <td>${agendamento.Status}</td>
//                 <td>${agendamento.Hora}</td>
//                 <td>${agendamento.Dati}</td>
//                 <td>
//                     <button class="btn btn-warning" onclick="editarAgendamento(${agendamento.ID})">Editar</button>
//                     <button class="btn btn-danger" onclick="deletarAgendamento(${agendamento.ID})">Deletar</button>
//                 </td>
//             `;
//             tabelaBody.appendChild(tr);
//         });
//     } catch (error) {
//         console.error('Erro:', error);
//         alert("Ocorreu um erro ao listar os agendamentos. Tente novamente mais tarde.");
//     }
// }

// Função para criar um novo agendamento
// document.getElementById('formAgendamento').addEventListener('submit', async (e) => {
//     e.preventDefault();
    
//     const id_cliente = document.getElementById('id_cliente').value;
//     const id_servico = document.getElementById('id_servico').value;
//     const id_profissional = document.getElementById('id_profissional').value;
//     const status = document.getElementById('status').value;
//     const hora = document.getElementById('hora').value;
//     const data = document.getElementById('data').value;

//     const novoAgendamento = {
//         ID_C: id_cliente,
//         ID_S: id_servico,
//         ID_P: id_profissional,
//         Status: status,
//         Hora: hora,
//         Dati: data
//     };

//     try {
//         const response = await fetch(API_URL, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(novoAgendamento)
//         });

//         if (!response.ok) {
//             throw new Error('Erro ao criar agendamento');
//         }

//         alert("Agendamento criado com sucesso!");
//         listarAgendamentos(); // Atualiza a lista de agendamentos
//     } catch (error) {
//         console.error('Erro:', error);
//         alert("Ocorreu um erro ao tentar criar o agendamento. Tente novamente mais tarde.");
//     }
// });

// Função para deletar um agendamento
// async function deletarAgendamento(id) {
//     if (confirm("Tem certeza que deseja deletar este agendamento?")) {
//         try {
//             const response = await fetch(`${API_URL}/${id}`, {
//                 method: 'DELETE'
//             });

//             if (!response.ok) {
//                 throw new Error('Erro ao deletar agendamento');
//             }

//             alert("Agendamento deletado com sucesso!");
//             listarAgendamentos(); // Atualiza a lista de agendamentos
//         } catch (error) {
//             console.error('Erro:', error);
//             alert("Ocorreu um erro ao tentar deletar o agendamento. Tente novamente mais tarde.");
//         }
//     }
// }

// Função para editar um agendamento
// async function editarAgendamento(id) {
//     const id_cliente = prompt("Digite o novo ID do Cliente:");
//     const id_servico = prompt("Digite o novo ID do Serviço:");
//     const id_profissional = prompt("Digite o novo ID do Profissional:");
//     const status = prompt("Digite o novo Status:");
//     const hora = prompt("Digite a nova Hora (HH:MM):");
//     const data = prompt("Digite a nova Data (YYYY-MM-DD):");

//     const agendamentoAtualizado = {
//         ID_C: id_cliente,
//         ID_S: id_servico,
//         ID_P: id_profissional,
//         Status: status,
//         Hora: hora,
//         Dati: data
//     };

//     try {
//         const response = await fetch(`${API_URL}/${id}`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(agendamentoAtualizado)
//         });

//         if (!response.ok) {
//             throw new Error('Erro ao atualizar agendamento');
//         }

//         alert("Agendamento atualizado com sucesso!");
//         listarAgendamentos(); // Atualiza a lista de agendamentos
//     } catch (error) {
//         console.error('Erro:', error);
//         alert("Ocorreu um erro ao tentar atualizar o agendamento. Tente novamente mais tarde.");
//     }
// }

// Função para capturar os dados da tabela

window.addEventListener("load", async (e)=>{
    const response= await fetch(API_URL)
    const tabelaComValores = await response.json()

    const tabelaBody = document.querySelector('#tabela-agenda tbody');
        tabelaBody.innerHTML = ''; // Limpa a tabela antes de adicionar

        tabelaComValores.forEach(agendamento => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <th scope="row">${agendamento.NOME_S}</th>
                <td>${agendamento.NOME}</td>
                <td>${agendamento.STATUS}</td>
                <td>${agendamento.HORA}</td>
                <td>${agendamento.DATI}</td>
            `;
            tabelaBody.appendChild(tr);
        })

});

function capturarDadosTabela() {
    const tabela = document.getElementById('tabela-agenda');
    const linhas = tabela.getElementsByTagName('tr');
    const dados = [];

    // Ignorar a primeira linha (cabeçalho)
    for (let i = 1; i < linhas.length; i++) {
        const colunas = linhas[i].getElementsByTagName('td');
        const objeto = {
            profissional: colunas[0].innerText,
            horario: colunas[2].innerText,
            data: colunas[3].innerText
        };
        dados.push(objeto);
    }

    return dados;
}

// Chamar a função e exibir os dados no console

// botão de confirmar

BtnConfirmarAgendamento.addEventListener("click", async e => {
    const resultado = capturarDadosTabela();
    const agendamentoAtual = {
        profissional: sessionStorage.getItem("nomeProfissional"),
        horario: BtnHora.value,
        data: BtnData.value
    };

    for (const agendamento of resultado) {

        // if (agendamento.profissional != agendamentoAtual.profissional &&
        //     agendamento.horario != agendamentoAtual.horario &&
        //     agendamento.data != agendamentoAtual.data) {
            if (agendamento.profissional === agendamentoAtual.profissional &&
                agendamento.horario === agendamentoAtual.horario &&
                agendamento.data === agendamentoAtual.data) {
                    return 
                }          

            const agendamentoFinal = {
                nome_cliente: sessionStorage.getItem("usuario"),
                nome_servico: sessionStorage.getItem("nomeServico"),
                nome_profissional: agendamentoAtual.profissional,
                Hora: agendamentoAtual.horario,
                Dati: agendamentoAtual.data 
            };

            try {
                const response = await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(agendamentoFinal)
                });

                sessionStorage.setItem("horario",agendamentoFinal.Hora);
                sessionStorage.setItem("data",agendamentoFinal.Dati);

                if (response.ok) {
                    window.location.href="agendamentoRealizado.html";
                } else {
                    console.error("Erro ao confirmar agendamento.");
                }
            } catch (error) {
                console.error("Erro na requisição:", error);
            };
        // }
    };
});



