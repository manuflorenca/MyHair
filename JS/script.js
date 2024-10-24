const t_field_nome=document.querySelector("#nome");
const t_field_senha=document.querySelector("#senha");
const form_login=document.querySelector("#form_login")


const validName = '';
const validPassword = '';

function entrarSistema(e){
    // e.preventDefault();
 
    if (t_field_nome.value === validNome && t_field_senha.value === validPassword) {
        // Login bem-sucedido, armazena no localStorage
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'index.html';
    } else {
        // Exibe a mensagem de erro
        document.getElementById('error-message').textContent = 'Nome ou senha incorretos';
    }
   
};
 
form_login.addEventListener("submit",entrarSistema);
 
if (localStorage.getItem('isLoggedIn')) {
    window.location.href = 'menu.html';
}
 