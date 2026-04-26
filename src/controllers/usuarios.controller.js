const prisma = require("../config/prisma"); 
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
class UsuariosController { 

static async login(req, res){
    const { email, senha } = req.body;

  if (!senha || !email) {
    return res.send(400, { message: "Informe email e senha" });
  }

  const user = await prisma.usuarios.findUnique({where: {email: email}});
  if (!user) {
    return res.send(401, { message: "Credenciais inválidas." });
  }

  const ok = bcrypt.compareSync(senha, user.senha);
  if (!ok) {
    return res.send(401, { message: "Credenciais inválidas." });
  }

  const payload = {
    sub: String(user.id),
    nome: user.nome,
    
  };
  
  if (!process.env.JWT_SECRET) {
    return res.send(500, {
      message: "Configuração ausente: JWT_SECRET não definido.",
    });
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  });

  return res.json({
    tokenType: "Bearer",
    accessToken: token,
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  });
}







static async alterar(req, res) {
  try {
    const { nome } = req.body;
    const { sub } = req.user;

    if (!nome) {
      return res.send(400, { message: "Nome é obrigatório." });
    }

    const usuario = await prisma.usuarios.findUnique({
      where: { id: Number(sub) }
    });

    if (!usuario) {
      return res.send(404, { message: "Usuário não encontrado." });
    }

    const usuarioAtualizado = await prisma.usuarios.update({
      where: { id: Number(sub) },
      data: { nome }
    });

    return res.send(200, usuarioAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return res.send(500, { message: "Erro ao atualizar usuário." });
  }
}

  static async listar(req, res) { 
    try { 
      const usuarios = await prisma.usuarios.findMany({ 
        orderBy: { id: "asc" } 
      }); 
 
      res.send(200, usuarios); 
    } catch (error) { 
      console.error("Erro Prisma:", error);
      res.send(500, { message: "Erro ao listar usuários." }); 
    } 
  } 
 
static async perfil(req, res) {
  try {
    const { sub } = req.user;

    const usuario = await prisma.usuarios.findUnique({
      where: { id: Number(sub) }
    });

    if (!usuario) {
      return res.send(404, { message: "Usuário não encontrado." });
    }
    const { senha, ...dadosPublicos } = usuario;

    res.send(200, dadosPublicos);
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    res.send(500, { message: "Erro ao processar requisição." });
  }
}

  static async criar(req, res) { 
    try { 
      const { nome, email, senha } = req.body; 
      if (!nome || !email || !senha) { 
        res.send(400, { 
          message: "Nome, senha e email são obrigatórios." 
        }); 
      } 

      const senhaHash = await bcrypt.hash(senha, 10);

      const novoUsuario = await prisma.usuarios.create({ 
        data: { nome, email, senha: senhaHash } 
      }); 

      res.send(201, novoUsuario); 
    } catch (error) { 
      if (error.code === "P2002") { 
        res.send(409, { message: "Já existe usuário com esse email." }); 
      } 
 
      res.send(500, { message: "Erro ao cadastrar usuário." }); 
    } 
  }
  
  
  static async deletar(req, res) {
  try {
    const { sub } = req.user;

    const usuario = await prisma.usuarios.findUnique({
      where: { id: Number(sub) }
    });

    if (!usuario) {
      return res.send(404, { message: "Usuário não encontrado." });
    }

    await prisma.usuarios.delete({
      where: { id: Number(sub) }
    });

    return res.send(200, { message: "Usuário deletado com sucesso." });

  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    return res.send(500, { message: "Erro ao deletar usuário." });
  }
}




static async getProdutoByUser(req, res) {
  try {
    const { sub } = req.user;

    if (!sub) {
      return res.send(400, { message: "Usuário não autenticado." });
    }

    const response = await fetch(`http://localhost:3004/pedidos/getPedidosByUsuario/${sub}`);

    if (!response.ok) {
      return res.send(404, { message: "Dados não encontrados no mock." });
    }

    const data = await response.json();

    return res.send(200, {
      usuarioLogado: sub,
      dadosMock: data
    });

  } catch (error) {
    console.error("Erro na requisição mock:", error);
    return res.send(500, { message: "Erro ao buscar dados mock." });
  }
}





} 
 

module.exports = UsuariosController; 