/* ================= PRODUTOS ================= */
const produtos = [
{
nome: "Buquê Primavera",
preco: 120,
imagem: "imagens/buque_8.jpg"
},
{
nome: "Buque de Girasol",
preco: 30,
imagem: "imagens/buque_rosa.jpg"
},
{
nome: "Buque de noiva",
preco: 110,
imagem: "imagens/buque_8.jpg"
},
{
nome: "Orquídea Elegante",
preco: 180,
imagem: "imagens/buque_1.jpg"
},
{
nome: "Girassóis Radiantes",
preco: 130,
imagem: "imagens/buque_2.jpg"
},
{
nome: "Girassóis Radiantes",
preco: 130,
imagem: "imagens/buque_3.jpg"
},
{
nome: "Girassóis Radiantes",
preco: 130,
imagem: "imagens/buque_4.jpg"
},
{
nome: "Girassóis Radiantes",
preco: 130,
imagem: "imagens/buque_5.jpg"
},
{
nome: "Girassóis Radiantes",
preco: 130,
imagem: "imagens/buque_6.jpg"
},
{
nome: "Girassóis Radiantes",
preco: 130,
imagem: "imagens/buque_7.jpg"
}
];

/* ================= CARRINHO ================= */
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

const lista = document.getElementById("lista-produtos");

produtos.forEach((produto, index)=>{
lista.innerHTML += `
<div class="card">
<img src="${produto.imagem}">
<h3>${produto.nome}</h3>
<p>R$ ${produto.preco}</p>
<button onclick="adicionar(${index})">Adicionar ao carrinho</button>
</div>
`;
});

function salvarCarrinho(){
localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function adicionar(index){
carrinho.push(produtos[index]);
salvarCarrinho();
atualizarCarrinho();
}

function remover(index){
carrinho.splice(index,1);
salvarCarrinho();
atualizarCarrinho();
}

function atualizarCarrinho(){
const listaCarrinho = document.getElementById("itensCarrinho");
const contador = document.getElementById("contador");
const total = document.getElementById("total");

listaCarrinho.innerHTML = "";
let soma = 0;

carrinho.forEach((item, index)=>{
listaCarrinho.innerHTML += `
<li>
${item.nome} - R$ ${item.preco}
<button class="btn-remover" onclick="remover(${index})">X</button>
</li>
`;
soma += item.preco;
});

contador.textContent = carrinho.length;
total.textContent = soma;
}

function abrirCarrinho(){
document.getElementById("carrinho").classList.add("ativo");
}

function fecharCarrinho(){
document.getElementById("carrinho").classList.remove("ativo");
}

/* ================= CHECKOUT ================= */
function irParaCheckout(){
if(carrinho.length === 0){
alert("Seu carrinho está vazio");
return;
}

document.getElementById("carrinho").classList.remove("ativo");
document.getElementById("checkout").style.display = "block";
window.scrollTo(0, document.getElementById("checkout").offsetTop);

const resumo = document.getElementById("resumoPedido");
const totalCheckout = document.getElementById("totalCheckout");

resumo.innerHTML = "";
let soma = 0;

carrinho.forEach(item=>{
resumo.innerHTML += `<li>${item.nome} - R$ ${item.preco}</li>`;
soma += item.preco;
});

totalCheckout.textContent = soma;
}

/*  FINALIZAR WHATSAPP  */
function finalizarWhatsApp(){
const nome = document.getElementById("nomeCliente").value;
const endereco = document.getElementById("enderecoCliente").value;

if(nome === "" || endereco === ""){
alert("Preencha seus dados");
return;
}

let mensagem = `Olá! Meu nome é ${nome}.%0AQuero finalizar a compra:%0A`;
let total = 0;

carrinho.forEach(item=>{
mensagem += `- ${item.nome} (R$ ${item.preco})%0A`;
total += item.preco;
});

mensagem += `%0ATotal: R$ ${total}%0AEndereço: ${endereco}`;

window.open(
`https://wa.me/5521990911804?text=${mensagem}`,
"_blank"
);

carrinho = [];
salvarCarrinho();
atualizarCarrinho();
}

/* PIX (SIMULADO)  */
function pagarPix(){
alert(
"CHAVE PIX: 21990911804\n\nApós o pagamento, envie o comprovante pelo WhatsApp."
);
}

/*  CONTATO */
function enviarContatoWhatsApp(event){
event.preventDefault();

const nome = document.getElementById("contatoNome").value;
const email = document.getElementById("contatoEmail").value;
const mensagem = document.getElementById("contatoMensagem").value;

let texto = `Olá! Meu nome é ${nome}.%0AEmail: ${email}%0AMensagem: ${mensagem}`;

window.open(
`https://wa.me/5521990911804?text=${texto}`,
"_blank"
);
}

/*  INIT  */
atualizarCarrinho();
