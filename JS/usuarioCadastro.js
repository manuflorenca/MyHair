const API_USER = 'http://127.0.0.1:5000/usuario';
 
 
const formCadastro=document.querySelector("#formCadastro");
 
formCadastro.addEventListener("submit", async (e)=>{
 
    e.preventDefault();
 
    const usuario={
        nome:document.querySelector("#nome_cadastrar").value,
        senha:document.querySelector("#senha_cadastrar").value
    }
 
    try{
        await fetch(API_USER, {
            method:"POST",
            headers:{ 'Content-Type': 'application/json' },
            body:JSON.stringify(usuario)
        })

        formCadastro.reset();
 
    }catch(erro){
        alert("Não foi possivel cadastrar")
    }
 
} )
 