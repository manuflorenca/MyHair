const menuBtn = document.getElementById('menu-btn');
const sidebar = document.getElementById('sidebar');
const wrapper = document.querySelector('.wrapper');
const btnPopup = document.querySelector('#btnPopup');
const iconClose = document.querySelector('.icon-close');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const t_field_nome = document.querySelector("#nome");
const t_field_senha = document.querySelector("#senha");
const form_login = document.querySelector("#formLogin");
const errorMessage = document.getElementById('error-message');

const validNome = 'user';
const validPassword = '123';

// Função para realizar login
function entrarConta(e) {
    e.preventDefault(); // Impede o envio do formulário

    if (t_field_nome.value === validNome && t_field_senha.value === validPassword) {
        // Login bem-sucedido, armazena no localStorage
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = '../HTML/agenda.html'; // Redireciona para a agenda
    } else {
        // Exibe a mensagem de erro
        errorMessage.textContent = 'Nome ou senha incorretos';
    }
}

// Associando o evento submit ao formulário
form_login.addEventListener("submit", entrarConta);

// Verificação para redirecionar se já estiver logado
window.onload = function() {
    if (localStorage.getItem('isLoggedIn')) {
        window.location.href = '../HTML/agenda.html';
    }
}

btnPopup.addEventListener('click', () => {
    wrapper.classList.add('active-popup');
});


iconClose.addEventListener('click', () => {
    wrapper.classList.remove('active-popup');
});


registerLink.addEventListener('click', () => {
    wrapper.classList.add('active');
});


loginLink.addEventListener('click', () => {
    wrapper.classList.remove('active');
});


btn.addEventListener('click', (e) => {
    sidebar.classList.toggle('show');
});




