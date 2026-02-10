/* ===== PRODUTOS ===== */
/* ===== PRODUTOS ===== */
let produtos = JSON.parse(localStorage.getItem("produtos")) || [
  {
    nome: "Buquê Primavera",
    preco: 120,
    tamanho: "Médio",
    categoria: "Buquê",
    descricao: "Flores coloridas que transmitem alegria e carinho.",
    imagem: "https://picsum.photos/400?1"
  },
  {
    nome: "Buquê de Girassol",
    preco: 130,
    tamanho: "Grande",
    categoria: "Buquê",
    descricao: "Girassóis vibrantes, ideal para iluminar o dia.",
    imagem: "https://picsum.photos/400?2"
  },
  {
    nome: "Buquê de Rosas Vermelhas",
    preco: 150,
    tamanho: "Médio",
    categoria: "Buquê",
    descricao: "Clássico romântico para momentos especiais.",
    imagem: "https://picsum.photos/400?3"
  },
  {
    nome: "Orquídea Branca",
    preco: 180,
    tamanho: "Pequeno",
    categoria: "Orquídea",
    descricao: "Elegante e delicada para ambientes internos.",
    imagem: "https://picsum.photos/400?4"
  }
];

/* ===== Sempre atualizar localStorage com novos produtos ===== */
localStorage.setItem("produtos", JSON.stringify(produtos));

/* ===== ESTADOS ===== */
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
let produtoSelecionado = null;
let frete = 0;

/* ===== ELEMENTOS ===== */
const listaProdutos = document.getElementById("lista-produtos");
const modal = document.getElementById("modalProduto");
const listaFavoritos = document.getElementById("listaFavoritos");

/* ===== RENDER PRODUTOS ===== */
function renderProdutos() {
  listaProdutos.innerHTML = "";

  produtos.forEach((p, i) => {
    listaProdutos.innerHTML += `
      <div class="card" onclick="abrirProduto(${i})">
        <img src="${p.imagem}">
        <h3>${p.nome}</h3>
        <p>R$ ${p.preco}</p>

        <button onclick="event.stopPropagation(); adicionarCarrinho(${i})">
          Comprar
        </button>

        <button class="btn-like ${favoritos.includes(i) ? "ativo" : ""}"
          onclick="event.stopPropagation(); curtir(${i})">
          ❤️
        </button>
      </div>
    `;
  });
}

/* ===== MODAL PRODUTO ===== */
function abrirProduto(index) {
  const p = produtos[index];
  produtoSelecionado = index;

  modal.classList.add("ativo");
  modalImagem.src = p.imagem;
  modalNome.textContent = p.nome;
  modalDescricao.textContent = p.descricao;
  modalTamanho.textContent = p.tamanho;
  modalCategoria.textContent = p.categoria;
  modalPreco.textContent = p.preco;
}

function fecharProduto() {
  modal.classList.remove("ativo");
}

modal.addEventListener("click", (e) => {
  if (e.target === modal) fecharProduto();
});

function comprarDoModal() {
  if (produtoSelecionado === null) return;
  adicionarCarrinho(produtoSelecionado);
  fecharProduto();
}

/* ===== CARRINHO ===== */
function adicionarCarrinho(index) {
  carrinho.push(produtos[index]);
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  atualizarCarrinho();
}

function atualizarCarrinho() {
  const ul = document.getElementById("itensCarrinho");
  ul.innerHTML = "";
  let total = 0;

  carrinho.forEach((item, i) => {
    ul.innerHTML += `
      <li>
        ${item.nome} - R$ ${item.preco}
        <button onclick="removerCarrinho(${i})">❌</button>
      </li>
    `;
    total += item.preco;
  });

  document.getElementById("contador").textContent = carrinho.length;
  document.getElementById("total").textContent = total;
  atualizarCheckout();
}

function removerCarrinho(index) {
  carrinho.splice(index, 1);
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  atualizarCarrinho();
}

/* ===== FAVORITOS ===== */
function curtir(index) {
  if (favoritos.includes(index)) {
    favoritos = favoritos.filter(i => i !== index);
  } else {
    favoritos.push(index);
  }

  localStorage.setItem("favoritos", JSON.stringify(favoritos));
  atualizarFavoritos();
}

function removerFavorito(indexProduto) {
  favoritos = favoritos.filter(i => i !== indexProduto);
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
  atualizarFavoritos();
}

function atualizarFavoritos() {
  document.getElementById("contador-fav").textContent = favoritos.length;
  renderProdutos();
  renderFavoritos();
}

function renderFavoritos() {
  listaFavoritos.innerHTML = "";

  if (favoritos.length === 0) {
    listaFavoritos.innerHTML = "<li>Nenhum favorito ainda 💔</li>";
    return;
  }

  favoritos.forEach(i => {
    const p = produtos[i];
    listaFavoritos.innerHTML += `
      <li style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <img src="${p.imagem}" style="width:50px;height:50px;object-fit:cover;border-radius:8px">
        <div style="flex:1">
          <strong>${p.nome}</strong><br>
          <small>${p.tamanho} • R$ ${p.preco}</small>
        </div>
        <button onclick="removerFavorito(${i})"
          style="background:none;border:none;font-size:18px;cursor:pointer">
          ❌
        </button>
      </li>
    `;
  });
}

/* ===== ABRIR / FECHAR ===== */
function abrirCarrinho() {
  document.getElementById("carrinho").classList.add("ativo");
}
function fecharCarrinho() {
  document.getElementById("carrinho").classList.remove("ativo");
}
function abrirFavoritos() {
  document.getElementById("favoritos").classList.add("ativo");
  renderFavoritos();
}
function fecharFavoritos() {
  document.getElementById("favoritos").classList.remove("ativo");
}

/* ===== CHECKOUT ===== */
function irParaCheckout() {
  if (carrinho.length === 0) return alert("Seu carrinho está vazio");
  fecharCarrinho();
  document.getElementById("checkout").style.display = "flex";
}

function fecharCheckout() {
  document.getElementById("checkout").style.display = "none";
}

function calcularFrete() {
  frete = 20;
  document.getElementById("valorFrete").textContent = frete;
  atualizarCheckout();
}

function atualizarCheckout() {
  const ul = document.getElementById("resumoPedido");
  ul.innerHTML = "";
  let soma = 0;

  carrinho.forEach(item => {
    ul.innerHTML += `<li>${item.nome} - R$ ${item.preco}</li>`;
    soma += item.preco;
  });

  document.getElementById("totalCheckout").textContent = soma + frete;
}

function finalizarWhatsApp() {
  const nome = document.getElementById("nomeCliente").value.trim();
  const endereco = document.getElementById("enderecoCliente").value.trim();
  const cep = document.getElementById("cepCliente").value.trim();

  if (!nome || !endereco || !cep) {
    alert("Preencha nome, endereço e CEP para finalizar o pedido.");
    return;
  }

  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }

  let subtotal = 0;
  let mensagem =
    "🌸 *NOVO PEDIDO - GARDEN TENT* 🌸%0A%0A" +
    `👤 *Cliente:* ${nome}%0A` +
    `📍 *Endereço:* ${endereco}%0A` +
    `📮 *CEP:* ${cep}%0A%0A` +
    "🛒 *Itens do Pedido:*%0A";

  carrinho.forEach(item => {
    mensagem += `• ${item.nome} (${item.tamanho}) - R$ ${item.preco}%0A`;
    subtotal += item.preco;
  });

  mensagem +=
    `%0A💰 *Subtotal:* R$ ${subtotal}` +
    `%0A🚚 *Frete:* R$ ${frete}` +
    `%0A💳 *Total:* R$ ${subtotal + frete}`;

  const telefone = "5521990911804";
  window.open(`https://wa.me/${telefone}?text=${mensagem}`, "_blank");

  // SALVAR PEDIDO NO LOCALSTORAGE PARA ADMIN
  let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
  pedidos.push({
    cliente: nome,
    endereco,
    cep,
    itens: [...carrinho],
    total: subtotal + frete,
    data: new Date().toLocaleString()
  });
  localStorage.setItem("pedidos", JSON.stringify(pedidos));

  // Limpa carrinho
  carrinho = [];
  localStorage.removeItem("carrinho");
  atualizarCarrinho();
  fecharCheckout();
}
/* ===== INIT ===== */
renderProdutos();
atualizarCarrinho();
atualizarFavoritos();
