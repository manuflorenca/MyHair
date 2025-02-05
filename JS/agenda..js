const listaServico = document.getElementById('ID_S');

const dados=[


]



document.addEventListener('DOMContentLoaded', function() {
    // Pegue todas as opções do dropdown
    const corte = document.getElementById('1');
    const manicure = document.getElementById('4');
    const tintura = document.getElementById('5');
  
    // Função para redirecionar para o HTML desejado
    function redirecionar() {
      window.location.href = 'escolhaCabeleireira.html';
    }
  
    // Adicionando o evento de clique em cada item do dropdown
    corte.addEventListener('click', redirecionar);
    manicure.addEventListener('click', redirecionar);
    tintura.addEventListener('click', redirecionar);

    //pegar o id da tag UL
    //ler o get serviço da app
    //map e get serviço, lendo o nome de cada serviço e colocando eles dentro de um li
    //esse li vai estar dentro da tag UL
  });

