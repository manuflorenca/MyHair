const API_URL = 'http://127.0.0.1:5000/profissional'; //http://127.0.0.1:5000/profissional

const userForm = document.getElementById('userForm');
const userTable = document.getElementById('userTable');

document.getElementById('btn_addCompetencia').addEventListener('click', function() {
    const container = document.getElementById('competencia-container');
    container.classList.toggle('hide');
});





userForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const dados = {
        nome: document.querySelector("#name").value,
        senha: document.querySelector("#senha").value,
        email: document.querySelector("#email").value,
        celular: document.querySelector("#celular").value,
        adm: document.querySelector("#adm").checked
    };
    
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });

        console.log("O erro tá aqui")
       
        const result = await response.json();
        alert(result.message || result.error);
        const form = document.getElementById('userForm');
        form.reset();
    } catch (error) {
        console.error("Erro ao cadastrar usuário: ", error);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const usuario = sessionStorage.getItem('usuario');


    const nomeUsuario=document.querySelector(".nomeDoUsuario");

    nomeUsuario.style.display = 'block';
    nomeUsuario.innerHTML=usuario

    

});