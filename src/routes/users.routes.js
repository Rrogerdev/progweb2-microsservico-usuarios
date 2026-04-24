const express = require('express');
const prisma = new PrismaClient();
const { authenticateToken } = require("../middlewares/authenticateToken");
const { authorizeRoles } = require("../middlewares/authorizeRoles");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 10);
        const skip = (page - 1) * limit;

        // Busca no banco de dados real
        const items = await prisma.usuario.findMany({
            skip: skip,
            take: limit,
        });

        const total = await prisma.usuario.count();

        res.status(200).json({ page, limit, total, items });
    } catch (error) {
        res.status(500).json({ message: "Erro ao listar usuários.", error: error.message });
    }
});
// Criar rota get por id

router.get("/currUser", authenticateToken, (req, res) => {
    res.status(200).json({ user: req.user });
});


router.get("/:id", (req, res) => {
    const id = Number(req.params.id);

    const user = repo.getById(id);
    if(user == null)
        res.status(404).json({message: "Usuário não encontrado."});

    res.status(200).json({user});
});

// Criar rota POST
// Protegidos (user e admin)
router.post("/", authenticateToken, authorizeRoles("user", "admin"),(req, res) => {
    const name = req.body.name;

    const user = repo.create(name);

    res.status(201).json({user});
});




// Criar rota PUT
router.put("/:id", authenticateToken, authorizeRoles("user", "admin"), (req, res) => {
    const name = req.body.name;
    const id = Number(req.params.id);

    const user = repo.edit(id,name);

    if(user == null)
        res.status(404).json({message: "Usuário não encontrado."});

    res.status(200).json({user});
});

// Criar rota DELETE
router.delete("/:id", authenticateToken, authorizeRoles("admin"), (req, res) => {
    const id = Number(req.params.id);

    const action = repo.deleteUser(id);

    if(action == null)
        res.status(404).json({message: "Usuário não encontrado."});

    res.status(204).json();
});


router.patch("/:id", authenticateToken, authorizeRoles("user", "admin"), (req, res) => {
    const id = Number(req.params.id);
    const name = req.body.name;

    const user = repo.getById(id);

    if (user == null) {
        return res.status(404).json({ message: "Usuário não encontrado." });
    }

    // Atualiza só se vier no body
    if (name !== undefined) {
        user.name = name;
    }

    res.status(200).json({ user });
});


router.get("/:id/pedidos", async (req, res) => {
    const id = Number(req.params.id);

    const user = repo.getById(id);
    if (user == null) {
        return res.status(404).json({ message: "Usuário não encontrado." });
    }

    try {
        const response = await fetch(`http://localhost:3002/pedidos?userId=${id}`);

        if (!response.ok) {
            return res.status(502).json({ message: "Erro ao buscar pedidos." });
        }

        const pedidos = await response.json();

        res.status(200).json({ pedidos });

    } catch (error) {
        res.status(500).json({ message: "Erro na comunicação com serviço de pedidos." });
    }
});

module.exports = router;