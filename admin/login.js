// Usuários cadastrados
const usuarios = [
  { nome: "administrador", senha: "gardentent123" }
];

// Função de login
function login(event) {
  event.preventDefault(); // Evita reload do form

  const usuarioInput = document.getElementById("usuario").value.trim();
  const senhaInput = document.getElementById("senha").value.trim();
  const erroEl = document.getElementById("erro");

  // Procura usuário
  const usuario = usuarios.find(u => u.nome === usuarioInput);

  if (!usuario) {
    erroEl.textContent = "Usuário não encontrado";
    return;
  }

  if (usuario.senha === senhaInput) {
    // Login válido
    localStorage.setItem("adminLogado", "true");
    localStorage.setItem("usuarioLogado", usuario.nome);
    window.location.href = "painel.html";
  } else {
    erroEl.textContent = "Senha incorreta";
  }
}
