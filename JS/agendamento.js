// script.js
document.getElementById('mostrarData').addEventListener('click', function() {
    const dataSelecionada = document.getElementById('data').value;
    const resultado = document.getElementById('resultado');
    
    if (dataSelecionada) {
      resultado.textContent = `Você selecionou a data: ${dataSelecionada}`;
    } else {
      resultado.textContent = 'Por favor, selecione uma data.';
    }
  });
  