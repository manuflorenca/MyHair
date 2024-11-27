const API_USER='http://127.0.0.1:5000/users'
 
const formLogin=document.querySelector("#formLogin");

const nome=document.querySelector("#nome");
const senha=document.querySelector("#senha");

formLogin.addEventListener("submit",async (e)=>{
    const response = await fetch(API_USER);

    // Esse é o nosso json
    const users = await response.json();
    const user = users.find(user => user.nome === nome.value && user.senha === senha.value);

    if (user) {
        // Se o usuário for encontrado, cria a sessão e redireciona para o menu
        sessionStorage.setItem('usuario', user.nome);  // Armazena na sessão local do navegador (sessionStorage)
        window.location.href = "agenda.html";  // Redireciona para a página menu.html
    } else {
        alert("Usuário ou senha inválidos!");
    }
    
} ) // esse é o final do evento de submit


