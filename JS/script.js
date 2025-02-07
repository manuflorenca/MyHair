// Chando API para trocar o nome
const API_URL = 'http://127.0.0.1:5000/usuario';

// Testando

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



// async function getAdmByUserId(userId) {
//     const apiUrl = `http://127.0.0.1:5000/selectAdmin/${userId}`;

//     try {
//         const response = await fetch(apiUrl);

//         // Verifica se a resposta foi bem-sucedida
//         if (!response.ok) {
//             throw new Error(`Erro: ${response.status} - ${response.statusText}`);
//         }

//         const data = await response.json();
//         console.log(`Adm para o usuário ${userId}:`, data.Adm);
//         return data.Adm; // Retorna o valor da coluna Adm
//     } catch (error) {
//         console.error('Erro ao buscar Adm:', error);
//     }
// }








// Trocando usuario

  userForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const response = await fetch(API_URL);
    const users = await response.json();
   
    
    const user = users.find(user => user.Nome === nome.value && user.Senha === senha.value);

    var profissionalID=nome;
    try {
                const apiUrl = `http://127.0.0.1:5000/selectAdmin/${user.ID}`;
                const response = await fetch(apiUrl);
        
                // Verifica se a resposta foi bem-sucedida
                if (!response.ok) {
                    throw new Error(`Erro: ${response.status} - ${response.statusText}`);
                }
        
                const data = await response.json();
                console.log(`Adm para o usuário ${user.ID}:`, data.Adm);
                profissionalID= data.Adm
                // return data.Adm; // Retorna o valor da coluna Adm
    } catch (error) {
                console.error('Erro ao buscar Adm:', error);
    }

    // Fazer um get usando o ID de usario para buscar dentro da entidade profissional se ele é adm
   

    // console.log(getAdmByUserId(user.ID))
  
    if (user && profissionalID===0) {
        // Lógica para Administrador
        
        // Exibe apenas o link de cadastro de cabeleireiras
        document.getElementById('linkCadastrar').style.display = 'block';  // Exibe o link de cadastro de cabeleireiras

// Banner
sessionStorage.setItem('usuario', user.Nome);  // Armazena na sessão local do navegador (sessionStorage)
sessionStorage.setItem('usuarioId',user.ID);
document.getElementById('userGreeting').innerText = `Bem-vindo, ${user.Nome}! você já está logado`;
document.getElementById('userGreeting').style.display = 'block';
document.querySelector('.form-box.login').style.display = 'none'; // Oculta a caixa de login
document.querySelector('.form-box.register').style.display = 'none'; // Oculta a caixa de cadastro
iconeUsuario.style.display = 'none';
nomeUsuario.style.display = 'block';
nomeUsuario.innerHTML = `${user.Nome}`

        // Oculta todos os outros itens de menu
        const menuItems = document.querySelectorAll('ul li'); // Seleciona todos os <li> dentro de <ul>
        menuItems.forEach(item => {
            if (item.id == 'linkCadastrar') {  // Se não for o link de cadastro
                item.style.display = 'none';  // Oculta o item de menu
            }
        });
    }

    else if (user && profissionalID===1) {

        // Se o usuário for encontrado, cria a sessão e redireciona para o menu
        sessionStorage.setItem('usuario', user.Nome);  // Armazena na sessão local do navegador (sessionStorage)
        sessionStorage.setItem('usuarioId',user.ID);
        document.getElementById('userGreeting').innerText = `Bem-vindo, ${user.Nome}! você já está logado`;
        document.getElementById('userGreeting').style.display = 'block';
        document.querySelector('.form-box.login').style.display = 'none'; // Oculta a caixa de login
        document.querySelector('.form-box.register').style.display = 'none'; // Oculta a caixa de cadastro
        iconeUsuario.style.display = 'none';
        nomeUsuario.style.display = 'block';
        nomeUsuario.innerHTML = `${user.Nome}`

        // Caso seja um usuário comum, todos os itens de menu ficam visíveis
        const menuItems = document.querySelectorAll('ul li');
        menuItems.forEach(item => {
        item.style.display = 'block';  // Exibe todos os itens de menu
        });
        
    }
    

    else {
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



document.addEventListener('DOMContentLoaded', function() {
    const usuario = sessionStorage.getItem('usuario');

if(usuario){
    const nomeUsuario=document.querySelector(".nomeDoUsuario");
    const iconeUsuario=document.querySelector("#icon");
    iconeUsuario.style.display = 'none';
    nomeUsuario.style.display = 'block';
    nomeUsuario.innerHTML=usuario

} 

});