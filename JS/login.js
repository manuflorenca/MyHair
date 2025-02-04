const API_URL = 'http://127.0.0.1:5000/usuario';

const nome = document.querySelector("#nome");
const senha = document.querySelector("#senha");
const userForm = document.querySelector("#formLogin");

userForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error('Erro ao acessar a API');
        }

        const users = await response.json();
        const user = users.find(user => user.Nome === nome.value && user.Senha === senha.value);
        
        if (user) {
            sessionStorage.setItem('usuario', user.Nome);
            window.location.href = "agenda.html";
        } else {
            alert("Usuário ou senha inválidos!");
        }
    } catch (error) {
        console.error('Erro:', error);
        alert("Ocorreu um erro ao tentar fazer login. Tente novamente mais tarde.");
    }
});