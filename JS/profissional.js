const listaProfissional = document.getElementById('ID_P');
const API_URL_PROFISSIONAL = 'http://127.0.0.1:5000/profissional';
 
document.addEventListener('DOMContentLoaded', async function() {
  try {
    const profissional = await fetch(API_URL_PROFISSIONAL);
    const profissionais = await profissional.json(); // Converte a resposta para JSON
 
    // Limpa a lista antes de adicionar os novos serviços
    listaProfissional.innerHTML = '';
 
    // Itera sobre os serviços e adiciona um <option> para cada serviço
    profissionais.map((valor) => {
      listaProfissional.innerHTML += `<option value="${valor.Nome_Profissional}">${valor.Nome_Profissional}</option>`;
    });
 
  }
 
  catch (erro) {
    console.log("Erro ao carregar o serviço:", erro);
  }
});
 
 
 
// Adicionando o evento de 'change' para redirecionar ao escolher a opção
 
listaProfissional.addEventListener('change', function() {
  const profissionalEscolhido = listaProfissional.value; // Pega o valor da opção selecionada
  if (profissionalEscolhido) {
    sessionStorage.setItem("nomeProfissional",profissionalEscolhido);
    window.location.href = `agendamento.html?profissional=${encodeURIComponent(profissionalEscolhido)}`;
  }
});
 