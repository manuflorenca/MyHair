const menuBtn = document.getElementById('menu-btn');
const sidebar = document.getElementById('sidebar');
const wrapper = document.querySelector('.wrapper');
const btnPopup = document.querySelector('#btnPopup');
const iconClose = document.querySelector('.icon-close');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const iconeUsuario = document.querySelector('.iconeUsuario');
const nomeUsuario = document.querySelector('.nomeDoUsuario');




// Troca de loguin e cadastro

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

// Tentativa de troca 

// Simulação de usuários cadastrados
const users = {
    "usuario1": "senha1",
    "usuario2": "senha2"
};

// Manipulação do formulário de login
document.getElementById('formLogin').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const nome = document.getElementById('nome').value;
    const senha = document.getElementById('senha').value;

    // Verifica se o usuário está cadastrado
    if (users[nome] && users[nome] === senha) {
        document.getElementById('userGreeting').innerText = `Bem-vindo, ${nome}! você já está logado`;
        document.getElementById('userGreeting').style.display = 'block';
        document.querySelector('.form-box.login').style.display = 'none'; // Oculta a caixa de login
        document.querySelector('.form-box.register').style.display = 'none'; // Oculta a caixa de cadastro
        iconeUsuario.style.display = 'none';
        nomeUsuario.style.display = 'block';
        nomeUsuario.innerHTML = `${nome}`
        
    } else {
        document.getElementById('error-message').innerText = 'Usuário ou senha inválidos.';
    }
});




// Manipulação do link para cadastro
document.querySelector('.register-link').addEventListener('click', function() {
    document.querySelector('.form-box.login').style.display = 'none';
    document.querySelector('.form-box.register').style.display = 'block';
});

// Manipulação do link para voltar ao login
document.querySelector('.login-link').addEventListener('click', function() {
    document.querySelector('.form-box.register').style.display = 'none';
    document.querySelector('.form-box.login').style.display = 'block';
});





