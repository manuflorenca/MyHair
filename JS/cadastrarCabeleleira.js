const API_URL = 'http://127.0.0.1:5000/profissional';

const userForm = document.getElementById('userForm');
const userTable = document.getElementById('userTable');

document.getElementById('btn_addCompetencia').addEventListener('click', function() {
    const container = document.getElementById('competencia-container');
    container.classList.toggle('hide');
});

userForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const dados = {
        nome: document.querySelector("#Nome").value,
        senha: document.querySelector("#Senha").value,
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
       
        const result = await response.json();
        alert(result.message || result.error);
    } catch (error) {
        console.error("Erro ao cadastrar usuário: ", error);
    }
});
