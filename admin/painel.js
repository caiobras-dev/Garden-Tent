/* ===== ADMIN JS ===== */

/* ===== Helpers ===== */
function resolverImagem(url) {
  if (!url) return "https://picsum.photos/60?blur=2";
  const u = String(url).trim();
  if (u.startsWith("http://") || u.startsWith("https://") || u.startsWith("data:")) return u;
  if (u.startsWith("imagens/")) return "../" + u; // admin/ -> ../imagens/...
  return u;
}

function formatBRL(valor) {
  const n = Number(valor) || 0;
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/* ===== PEDIDOS ===== */
function atualizarPedidosAdmin() {
  const lista = document.getElementById("listaPedidos");
  lista.innerHTML = "";

  let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
  document.getElementById("qtdPedidos").textContent = pedidos.length;

  let totalVendas = pedidos.reduce((acc, pedido) => acc + Number(pedido.total || 0), 0);
  document.getElementById("totalVendas").textContent = formatBRL(totalVendas);

  pedidos.forEach((pedido, index) => {
    const li = document.createElement("li");

    const itensHtml = (pedido.itens || [])
      .map(i => `<li>${i.nome} (${i.tamanho}) - ${formatBRL(i.preco)}</li>`)
      .join("");

    li.innerHTML = `
      <strong>Pedido ${index + 1}:</strong> ${pedido.data}<br>
      👤 Cliente: ${pedido.cliente}<br>
      📍 Endereço: ${pedido.endereco}<br>
      📮 CEP: ${pedido.cep}<br>
      🛒 Itens:<br>
      <ul>${itensHtml}</ul>
      💳 Total: ${formatBRL(pedido.total)}
    `;
    lista.appendChild(li);
  });
}

/* ===== PRODUTOS ADMIN ===== */
let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
const listaProdutosAdmin = document.getElementById("listaProdutosAdmin");
const formProduto = document.getElementById("formProduto");

function renderProdutosAdmin() {
  produtos = JSON.parse(localStorage.getItem("produtos")) || [];
  listaProdutosAdmin.innerHTML = "";

  produtos.forEach((p, i) => {
    const img = resolverImagem(p.imagem);

    listaProdutosAdmin.innerHTML += `
      <li style="display:flex;align-items:center;gap:10px;">
        <img
          src="${img}"
          alt="${p.nome}"
          style="width:60px;height:60px;object-fit:cover;border-radius:6px"
          onerror="this.onerror=null;this.src='https://picsum.photos/60?blur=2';"
        >

        <div style="flex:1;min-width:0;">
          <strong>${p.nome}</strong>
          <div style="font-size:12px;opacity:.8;">
            ${p.tamanho || ""} ${p.categoria ? "• " + p.categoria : ""}
          </div>

          <!-- ✅ NOVO: trocar foto por URL -->
          <div style="margin-top:6px;display:flex;gap:8px;flex-wrap:wrap;">
            <input
              type="text"
              placeholder="Nova URL da imagem"
              value="${p.imagem || ""}"
              style="flex:1;min-width:200px;padding:6px;border:1px solid #ddd;border-radius:6px;"
              onchange="editarImagem(${i}, this.value)"
            >
          </div>
        </div>

        <div style="display:flex;align-items:center;gap:8px;">
          <span>R$</span>
          <input
            type="number"
            value="${Number(p.preco) || 0}"
            style="width:90px;padding:6px;border:1px solid #ddd;border-radius:6px;"
            onchange="editarPreco(${i}, this.value)"
          >
          <button onclick="removerProduto(${i})" style="padding:6px 10px;border:none;border-radius:6px;background:#ff4d4f;color:#fff;cursor:pointer;">
            ❌
          </button>
        </div>
      </li>
    `;
  });
}

function editarPreco(index, valor) {
  produtos[index].preco = Number(valor);
  localStorage.setItem("produtos", JSON.stringify(produtos));
}

function editarImagem(index, novaUrl) {
  produtos[index].imagem = String(novaUrl || "").trim();
  localStorage.setItem("produtos", JSON.stringify(produtos));
  renderProdutosAdmin(); // atualiza a prévia da imagem
}

function removerProduto(index) {
  if (!confirm(`Deseja remover "${produtos[index]?.nome}"?`)) return;
  produtos.splice(index, 1);
  localStorage.setItem("produtos", JSON.stringify(produtos));
  renderProdutosAdmin();
}

/* ===== ADICIONAR PRODUTO ===== */
formProduto.addEventListener("submit", (e) => {
  e.preventDefault();

  const novo = {
    nome: document.getElementById("nomeProduto").value,
    preco: Number(document.getElementById("precoProduto").value),
    tamanho: document.getElementById("tamanhoProduto").value,
    categoria: document.getElementById("categoriaProduto").value,
    descricao: document.getElementById("descricaoProduto").value,
    imagem: document.getElementById("imagemProduto").value
  };

  produtos.push(novo);
  localStorage.setItem("produtos", JSON.stringify(produtos));
  renderProdutosAdmin();
  formProduto.reset();
});

/* ===== RESETAR HISTÓRICO DE PEDIDOS ===== */
function resetarPedidos() {
  if (confirm("Tem certeza que deseja apagar todo o histórico de pedidos?")) {
    localStorage.removeItem("pedidos");
    atualizarPedidosAdmin();
    alert("Histórico de pedidos resetado!");
  }
}

/* ===== IMPRIMIR PEDIDOS ===== */
function imprimirPedidos() {
  const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
  if (pedidos.length === 0) {
    alert("Não há pedidos para imprimir.");
    return;
  }

  let conteudo = pedidos.map((pedido, index) => `
Pedido ${index + 1} - ${pedido.data}
Cliente: ${pedido.cliente}
Endereço: ${pedido.endereco}
CEP: ${pedido.cep}
Itens:
${(pedido.itens || []).map(i => `- ${i.nome} (${i.tamanho}) - ${formatBRL(i.preco)}`).join("\n")}
Total: ${formatBRL(pedido.total)}

`).join("\n----------------\n");

  const janela = window.open("", "_blank");
  janela.document.write("<pre>" + conteudo + "</pre>");
  janela.print();
}

/* ===== VOLTAR PARA LOJA ===== */
function voltarParaLoja() {
  window.location.href = "../index.html";
}

/* ===== LOGOUT ===== */
function logout() {
  alert("Você saiu do painel admin");
  window.location.href = "../index.html";
}

/* ===== INIT ===== */
renderProdutosAdmin();
atualizarPedidosAdmin();
