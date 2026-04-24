const prisma = require("../config/prisma"); 
 
class UsuariosController { 
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
      const { nome, email } = req.body; 
      console.log(nome, email);
      if (!nome || !email) { 
        res.send(400, { 
          message: "Nome e email são obrigatórios." 
        }); 
      } 
      const novoUsuario = await prisma.usuarios.create({ 
        data: { nome, email } 
      }); 

      res.send(201, novoUsuario); 
    } catch (error) { 
      if (error.code === "P2002") { 
        res.send(409, { message: "Já existe usuário com esse email." }); 
      } 
 
      res.send(500, { message: "Erro ao cadastrar usuário." }); 
    } 
  } 
} 
 
module.exports = UsuariosController; 