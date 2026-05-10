let input = document.getElementById('inputMensagem');
let botao = document.getElementById('enviar');
let mensagens = document.getElementById('mensagens');


let canais = {
    geral: [],
    projetos: [],
    memes: []
};



let canalAtual = 'geral';


let usuario = {
    nome: 'Kikyo',
    avatar: 'K'
};




function criarMensagem(texto, tipo, usuarioNome = 'Sistema') {

    let div = document.createElement('div');

    div.classList.add('mensagem');
    div.classList.add(tipo);

    let hora = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });

    div.innerHTML = `
        <div class="mensagem-topo">
            <strong>${usuarioNome}</strong>
            <span>${hora}</span>
        </div>

        <p>${texto}</p>

        <div class="acoes">
            <button class="editar">✏️</button>
            <button class="apagar">🗑️</button>
        </div>
    `;

    mensagens.appendChild(div);

    mensagens.scrollTop = mensagens.scrollHeight;



    let editar = div.querySelector('.editar');

    editar.addEventListener('click', function() {

        let novoTexto = prompt('Editar mensagem:', texto);

        if(novoTexto) {

            div.querySelector('p').textContent = novoTexto;

        }

    });




    let apagar = div.querySelector('.apagar');

    apagar.addEventListener('click', function() {

        div.remove();

    });

}




function renderizarMensagens() {

    mensagens.innerHTML = '';

    canais[canalAtual].forEach(msg => {

        criarMensagem(
            msg.texto,
            msg.tipo,
            msg.usuario
        );

    });

}




function salvar() {

    localStorage.setItem(
        'discordClone',
        JSON.stringify(canais)
    );

}




function carregar() {

    let dados = localStorage.getItem('discordClone');

    if(dados) {

        canais = JSON.parse(dados);

    }

    renderizarMensagens();

}



function enviarMensagem() {

    let texto = input.value.trim();

    if(texto === '') return;



    let mensagem = {

        id: Date.now(),

        texto: texto,

        tipo: 'usuario',

        usuario: usuario.nome

    };



    canais[canalAtual].push(mensagem);

    salvar();

    renderizarMensagens();

    input.value = '';


    setTimeout(() => {

        let respostaBot = {

            id: Date.now(),

            texto: 'Mensagem automática do sistema.',

            tipo: 'bot',

            usuario: 'Bot'

        };



        canais[canalAtual].push(respostaBot);

        salvar();

        renderizarMensagens();

    }, 700);

}




botao.addEventListener('click', enviarMensagem);




input.addEventListener('keydown', function(event) {

    if(event.key === 'Enter' && !event.shiftKey) {

        event.preventDefault();

        enviarMensagem();

    }

});




let canaisHTML = document.querySelectorAll('.channel');

canaisHTML.forEach(function(canal) {

    canal.addEventListener('click', function() {

        canaisHTML.forEach(c => {
            c.classList.remove('active');
        });

        canal.classList.add('active');



        canalAtual = canal.dataset.canal;



        document.querySelector('.chat-header').textContent =
            '# ' + canalAtual;



        renderizarMensagens();

    });

});



function criarCanal(nome) {

    if(canais[nome]) return;



    canais[nome] = [];



    let div = document.createElement('div');

    div.classList.add('channel');

    div.dataset.canal = nome;

    div.textContent = '# ' + nome;



    document.querySelector('.channels').appendChild(div);



    div.addEventListener('click', function() {

        canaisHTML.forEach(c => {
            c.classList.remove('active');
        });

        div.classList.add('active');

        canalAtual = nome;

        renderizarMensagens();

    });



    salvar();

}



function enviarImagem(event) {

    let arquivo = event.target.files[0];

    if(!arquivo) return;



    let leitor = new FileReader();

    leitor.onload = function(e) {

        let mensagem = {

            id: Date.now(),

            texto: `<img src="${e.target.result}" class="imagem-chat">`,

            tipo: 'usuario',

            usuario: usuario.nome

        };



        canais[canalAtual].push(mensagem);

        salvar();

        renderizarMensagens();

    };



    leitor.readAsDataURL(arquivo);

}



function exportarChat() {

    let dados = JSON.stringify(canais, null, 2);

    let blob = new Blob([dados], {
        type: 'application/json'
    });

    let link = document.createElement('a');

    link.href = URL.createObjectURL(blob);

    link.download = 'discord-clone.json';

    link.click();

}




function alternarTema() {

    document.body.classList.toggle('light');



    localStorage.setItem(
        'tema',
        document.body.classList.contains('light')
            ? 'light'
            : 'dark'
    );

}



function carregarTema() {

    let tema = localStorage.getItem('tema');

    if(tema === 'light') {

        document.body.classList.add('light');

    }

}
canaisHTML.forEach(function(canal){

    canal.addEventListener('click', function(){

        let nomeCanal = canal.dataset.canal;

        console.log(nomeCanal);

    });

});


carregar();

carregarTema();