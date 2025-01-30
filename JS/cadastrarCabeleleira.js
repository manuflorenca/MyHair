const API_URL_PROFISSIONAL = 'http://127.0.0.1:5000/profissional';
const API_URL_USUARIO = 'http://127.0.0.1:5000/usuario';
const API_URL_contato = 'http://127.0.0.1:5000/contato';
const userForm = document.getElementById('userForm');
const updateForm = document.getElementById('updateForm');
const userTable = document.getElementById('userTable');

userForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const usuario = {
        nome: document.querySelector("#Nome").value,
        senha: document.querySelector("#Senha").value
    };

    try {
        // Cadastra o usuário
        const response = await fetch(API_URL_USUARIO, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuario)
        });

        // Verifica se o cadastro foi bem-sucedido
        if (!response.ok) {
            throw new Error("Erro ao cadastrar usuário");
        }

        // Busca o ID e a senha do usuário recém-cadastrado
        const usersResponse = await fetch(API_URL_USUARIO);
        const users = await usersResponse.json();
        const newUser  = users.find(user => user.Nome === usuario.nome && user.Senha === usuario.senha);

        if (!newUser ) {
            throw new Error("Usuário não encontrado após cadastro");
        }

        
        // Cria o objeto profissional
        const profissional = {
            id: newUser.ID, // Aqui você pega o ID do novo usuário
            nome: newUser.nome,
            senha: newUser.senha, // Aqui você pega a senha do novo usuário
            adm: document.querySelector("#adm").checked, // Supondo que seja um checkbox
        };

        try{
        // Cadastra o profissional
        // Corrigir erro no fetch
        const profissionalResponse = await fetch(API_URL_PROFISSIONAL, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profissional)
        });
        }catch(erro){
            console.log("Erro : ",erro.message)
        }

        // if (!profissionalResponse.ok) {
        //     throw new Error("Erro ao cadastrar profissional");
        // }




        // Agora, você pode criar o objeto contato
        const contato = {
            profissional_id: profissional.id, // Aqui você usa o ID do profissional
            email: document.querySelector("#email").value,
            celular: document.querySelector("#celular").value,
        };

        // Cadastra o contato
        await fetch(API_URL_CONTATO, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contato)
        });

        userForm.reset();

    } catch (erro) {
        alert("Não foi possível cadastrar: " + erro.message);
    }
});





document.getElementById('btn_addCompetencia').addEventListener('click', function() {
    const container = document.getElementById('competencia-container');
    container.classList.toggle('hide');
});


// Initial fetch
// fetchUsers();
