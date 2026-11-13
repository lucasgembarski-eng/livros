//1) Pega os elementos da tela

const form = document.getElementById("form");
const lista = document.getElementById("lista");
const erro = document.getElementById("erro");

//2) busca os livros na API e mostra na tela

async function carregarLivros() {
    const resposta = await fetch("/livros");
    const livros = await resposta.json();

    lista.innerHTML = "";

    livros.forEach((livro) => {
        const item = document.createElement("li");

        item.innerHTML = `
            <span>${livro.titulo} - ${livro.autor} (${livro.ano}) . ${livro.editora || "Sem editora"} . ${livro.paginas || 0} páginas</span>
            <button class="del" data-id="${livro.id}">Excluir</button>
        `;
        lista.appendChild(item);
    });
}

// 3) cadastra um livro

form.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    erro.textContent = "";

    const dados = {
        titulo: document.getElementById("titulo").value,
        autor: document.getElementById("autor").value,
        ano: document.getElementById("ano").value,
        editora: document.getElementById("editora").value,
        paginas: document.getElementById("paginas").value,
    };

// 4) envia a requisição POST para criar um livro.

    const resposta = await fetch("/livros", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(dados),
    });

    if (!resposta.ok) {
        const info = await resposta.json();
        erro.textContent = info.erro;
        return;
    }

    form.reset();
    carregarLivros();
});

// 5) apaga um livro (delete)

lista.addEventListener("click", async (evento) => {
    if (!evento.target.dataset.id) return;

    await fetch(`/livros/${evento.target.dataset.id}`, { method: "DELETE", });

    carregarLivros();
});

carregarLivros();
