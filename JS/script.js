// Chando API para trocar o nome
const API_URL = 'http://127.0.0.1:5000/usuario';
const nome=document.querySelector("#nome");
const senha=document.querySelector("#senha");
const userForm=document.querySelector("#formLogin");

// login
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

// Trocando usuario

  userForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const response = await fetch(API_URL);
    // Trás os dados via API
    const users = await response.json();
    const user = users.find(user => user.Nome === nome.value && user.Senha === senha.value);
    if (user) {
        // Se o usuário for encontrado, cria a sessão e redireciona para o menu
        sessionStorage.setItem('usuario', user.Nome);  // Armazena na sessão local do navegador (sessionStorage)
        document.getElementById('userGreeting').innerText = `Bem-vindo, ${user.Nome}! você já está logado`;
        document.getElementById('userGreeting').style.display = 'block';
        document.querySelector('.form-box.login').style.display = 'none'; // Oculta a caixa de login
        document.querySelector('.form-box.register').style.display = 'none'; // Oculta a caixa de cadastro
        iconeUsuario.style.display = 'none';
        nomeUsuario.style.display = 'block';
        nomeUsuario.innerHTML = `${user.Nome}`
    } else {
        document.getElementById('error-message').innerText = 'Usuário ou senha inválidos.';
    }
 
  })

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





