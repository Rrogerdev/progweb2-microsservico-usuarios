const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { findByUsername } = require("../data/login.memory");

const router = express.Router();

router.post("/login", (req, res) => {
    const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Informe username e password." });
  }

  const user = findByUsername(username);
  if (!user) {
    return res.status(401).json({ message: "Credenciais inválidas." });
  }

  const ok = bcrypt.compareSync(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ message: "Credenciais inválidas." });
  }

  const payload = {
    sub: String(user.id),
    username: user.username,
    role: user.role,
  };
  
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
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
});

module.exports = router;
