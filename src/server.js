const restify = require("restify"); 
const { authenticateToken } = require("./middlewares/authenticateToken");
const UsuariosController = require("./controllers/usuarios.controller"); 
 
const server = restify.createServer({ 
  name: "api-usuarios-restify" 
}); 

server.use(restify.plugins.queryParser()); 
server.use(restify.plugins.bodyParser()); 

server.get("/usuarios", UsuariosController.listar); 
server.post("/usuarios", UsuariosController.criar); 
server.get("/usuarios/perfil", authenticateToken, UsuariosController.perfil);
const PORT = 3002; 
server.listen(PORT, () => { 
    console.log(`${server.name} rodando em ${server.url}`); 
}); 