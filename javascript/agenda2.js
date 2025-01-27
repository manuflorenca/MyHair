// Função para adicionar evento à lista
function adicionarEvento() {
    const eventoInput = document.getElementById("evento");
    const dataInput = document.getElementById("data");
    const listaEventos = document.getElementById("lista-eventos");
  
    const evento = eventoInput.value;
    const data = dataInput.value;
  
    if (!evento || !data) {
      alert("Por favor, preencha todos os campos!");
      return;
    }
  
    // Criando o item de evento
    const li = document.createElement("li");
    li.textContent = `${evento} - ${data}`;
  
    // Criando o botão de remover
    const btnRemover = document.createElement("button");
    btnRemover.textContent = "Remover";
    btnRemover.onclick = function() {
      listaEventos.removeChild(li);
    };
  
    // Adicionando o botão de remover ao item
    li.appendChild(btnRemover);
  
    // Adicionando o evento à lista
    listaEventos.appendChild(li);
  
    // Limpando os campos de input
    eventoInput.value = "";
    dataInput.value = "";
  }
  