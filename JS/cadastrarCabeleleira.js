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
    } catch (error) {
        console.error("Erro ao cadastrar usuário: ", error);
    }
});

// Função de limpar os inputs (Front)

function handleSubmit(event) {
    event.preventDefault(); // Impede o envio padrão do formulário
    
    // Limpa os campos do formulário
    const form = document.getElementById('userForm');
    form.reset();

    // Exibe uma mensagem de sucesso (opcional)
    alert("Usuário cadastrado com sucesso!");
}