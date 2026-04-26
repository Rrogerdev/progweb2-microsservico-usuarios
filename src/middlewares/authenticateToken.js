const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.send(401, { message: "Token ausente." });
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    return res
      .send(401, { message: "Formato inválido. Use: Authorization: Bearer <token>" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { sub, username, role, iat, exp }
    return next();
  } catch (err) {
    return res.send(401, { message: "Token inválido ou expirado." });
  }
}

module.exports = { authenticateToken };