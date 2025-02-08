const Hora = sessionStorage.getItem("horario");
const Data = sessionStorage.getItem("data");

// sessionStorage.removeItem("horario");
// sessionStorage.removeItem("data");

const exibirData = document.getElementById("exibirData");
const exibirHora = document.getElementById("exibirHorario");

exibirData.innerText=Data
exibirHora.innerText=Hora
