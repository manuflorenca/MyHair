const API_PRODUTO = 'http://127.0.0.1:5000/produtos';
 
 
const formProduto=document.querySelector("#formProduto");
const tabelaProduto=document.querySelector("#tabelaProduto");
 
// Função GET
async function fetchProdutos(){
try{
    const response = await fetch(API_PRODUTO); //
   
 
    if(!response.ok){
 
        console.error("Erro ao buscar o produto",response.status);
        return
    }
 
    const produtos=await response.json();
 
    console.log(produtos)
 
    tabelaProduto.innerHTML='';
 
    produtos.forEach(
     produto =>{
        tabelaProduto.innerHTML+=`
        <td>${produto.nome}</td>
        <td>${produto.marcar}</td>
        <td>${produto.valor}</td>
        `
 
     });
}catch(erro){
    console.error("Erro ao tentar carregar os dados",erro)
}
 
}
 
formProduto.addEventListener("submit", async (e)=>{
 
    e.preventDefault();
 
    const produto={
        nome:document.querySelector("#nome").value,
        marca:document.querySelector("#marca").value,
        valor:parseFloat(document.querySelector("#valor").value)
    }
 
    try{
        await fetch(API_PRODUTO, {
            method:"POST",
            headers:{ 'Content-Type': 'application/json' },
            body:JSON.stringify(produto)
        })
 
        fetchProdutos();
        formProduto.reset();
 
    }catch(erro){
        alert("Não foi possivel cadastrar")
    }
 
} )
 
fetchProdutos()