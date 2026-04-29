const restify = require("restify"); 
const { authenticateToken } = require("./middlewares/authenticateToken");
const UsuariosController = require("./controllers/usuarios.controller"); 
 
const server = restify.createServer({ 
  name: "api-usuarios-restify" 
}); 

server.use(restify.plugins.queryParser()); 
server.use(restify.plugins.bodyParser()); 

server.get("/usuarios",authenticateToken, UsuariosController.listar); 
server.post("/usuarios", UsuariosController.criar); 
server.get("/usuarios/perfil", authenticateToken, UsuariosController.perfil);
server.post("/usuarios/login", UsuariosController.login);
server.put("/usuarios/alterar",authenticateToken, UsuariosController.alterar);
server.get("/usuarios/produtos",authenticateToken, UsuariosController.getProdutoByUser);
const PORT = 3002; 
server.listen(PORT, () => { 
    console.log(`${server.name} rodando em ${server.url}`); 
}); 