const listaServico = document.getElementById('ID_S');
const API_URL = 'http://127.0.0.1:5000/servico';

document.addEventListener('DOMContentLoaded', async function() {
  try {
    const servico = await fetch(API_URL);
    const servicos = await servico.json(); // Converte a resposta para JSON

    // Limpa a lista antes de adicionar os novos serviços
    listaServico.innerHTML = ''; 

    // Itera sobre os serviços e adiciona um <option> para cada serviço
    servicos.map((valor) => {
      listaServico.innerHTML += `<option value="${valor.Nome_S}">${valor.Nome_S}</option>`;
    });

  } catch (erro) {
    console.log("Erro ao carregar o serviço:", erro);
  }
});

// Adicionando o evento de 'change' para redirecionar ao escolher a opção
listaServico.addEventListener('change', function() {
  const servicoEscolhido = listaServico.value; // Pega o valor da opção selecionada
  if (servicoEscolhido) {
    window.location.href = `escolhaCabeleireira.html?servico=${encodeURIComponent(servicoEscolhido)}`;
  }
});
