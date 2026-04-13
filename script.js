const cadastrarFilme = document.querySelector(".cadastrar-filme");
const nomeInput = document.getElementById("nome-filme");
const generoSelect = document.getElementById("genero");
const imagemFile = document.getElementById("imagem-do-filme");
const notaInput = document.getElementById("nota-filme");
const assistidoInput = document.getElementById("assistiu");
const mensagem = document.getElementById("mensagem");

const buscaInput = document.getElementById("busca");
const filtroGenero = document.getElementById("filtroGenero");

const listaFilmes = document.getElementById("listaFilmes");

const totalFilmes = document.getElementById("totalFilmes");
const totalAssistidos = document.getElementById("totalAssistidos");
const mediaNotas = document.getElementById("mediaNotas");

const filmes = [];

let salvaImagem = "";
let mensagemImagem = document.getElementById("nome-imagem");
function mostrarMensagem(texto, tipo) {
    mensagem.textContent = texto;
    mensagem.className = "mensagem";
    mensagem.classList.add(tipo);
}

function limparMensagem (){
    mensagem.textContent = "";
    mensagem.className = "mensagem";
}

function validarFormulario(nome, genero, imagem, nota) {
    if (nome === "" || genero === "" || imagem === "" || nota === "") {
        mostrarMensagem("Preencha todos os campos obrigatórios.", "erro");
        return false;
    }

    if (Number(nota) < 0 || Number(nota) > 10){
        mostrarMensagem("A nota deve estar entre 0 e 10.","erro");
        return false;
    }

    return true;
}

function limparFormulario(){
    cadastrarFilme.reset();
}

function criarFilme(nome, genero, imagem, nota, assistido){
    return {
        id: Date.now(),
        nome: nome,
        genero: genero,
        imagem: imagem,
        nota: Number(nota),
        assistido:assistido
    };
}

imagemFile.addEventListener('change', function(e) {
    const arquivo = e.target.files[0];

    if (arquivo) {
        const urlImagem = URL.createObjectURL(arquivo);
        salvaImagem = urlImagem
    }
    mensagemImagem.classList.add("selecionada");
    mensagemImagem.innerHTML = "Imagem Selecionada ✔️";
});

function adicionarFilme(event){
    event.preventDefault();
    const imagem = salvaImagem;
    const nome = nomeInput.value.trim();
    const genero = generoSelect.value;
    const nota = notaInput.value;
    const assistido = assistidoInput.checked;

    if (!validarFormulario(nome, genero, imagem, nota)){
        return;
    }

    const novoFilme = criarFilme(nome, genero, imagem, nota, assistido);

    filmes.push(novoFilme);

    mostrarMensagem("Filme adicionado com sucesso!", "sucesso");
    limparFormulario();
    renderizarFilmes();
    atualizarEstatisticas();
}

function removerFilme(id) {
    const indice = filmes.findIndex((filme) => filme.id === id);

    if (indice !== -1) {
        filmes.splice(indice, 1);
        renderizarFilmes();
        atualizarEstatisticas();
    }
}

function obterFilmeFiltrados() {
    const textoBusca = buscaInput.value.trim().toLowerCase();
    const generoSelecionado = filtroGenero.value;

    return filmes.filter((filme) => {
        const correspondeNome = filme.nome.toLowerCase().includes(textoBusca);
        const correspondeGenero = generoSelecionado === "Todos" || filme.genero === generoSelecionado;

        return correspondeNome && correspondeGenero;
    });
}

function renderizarFilmes() {
    const filmesFiltrados = obterFilmeFiltrados();

    listaFilmes.innerHTML = "";

    if (filmesFiltrados.length === 0) {
        listaFilmes.innerHTML = `<p class="vazio">Nenhum filme encontardo.</p>`;
        return;
    }

    filmesFiltrados.forEach((filme) => {
        const filmeCard = document.createElement("div");
        filmeCard.classList.add("filme-card");

        filmeCard.innerHTML =`
        <img src="${filme.imagem}" width = "70" height = "90">
        <h3>${filme.nome}</h3>
        <p class="filme-info"><strong>Gênero:</strong>${filme.genero}</p>
        <p class="filme-info"><strong>Nota:</strong>${filme.nota.toFixed(1)}</p>
        <span class="status ${filme.assistido ? "assistido" : "nao-assistido"}">${filme.assistido ? "Assistido" : "Não assistido"}</span>
        <br>
        <button class="btn-remover" data-id="${filme.id}">Remover</button>
        `;

        listaFilmes.appendChild(filmeCard);
    });

    const botoesRemover = document.querySelectorAll(".btn-remover");

    botoesRemover.forEach((botao) => {
        botao.addEventListener('click', function(){
            const id = Number(this.dataset.id);
            removerFilme(id);
        });
    })
}

function atualizarEstatisticas() {
    const quantidadeTotal = filmes.length;
    const quantidadeAssistidos = filmes.filter((filme) => filme.assistido).length;

    let media = 0;

    if (quantidadeTotal > 0){
        const somaNotas = filmes.reduce((acumulador, filme) => acumulador + filme.nota, 0);
        media = somaNotas / quantidadeTotal
    }

    totalFilmes.textContent = quantidadeTotal;
    totalAssistidos.textContent = quantidadeAssistidos;
    mediaNotas.textContent = media.toFixed(1);
}

cadastrarFilme.addEventListener("submit", adicionarFilme);

buscaInput.addEventListener("input", renderizarFilmes);
filtroGenero.addEventListener("change", renderizarFilmes);

nomeInput.addEventListener("input", limparMensagem);
generoSelect.addEventListener("change", limparMensagem);
notaInput.addEventListener("input", limparMensagem);

renderizarFilmes();
atualizarEstatisticas();