function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.send(401, { message: "Não autenticado." });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.send(403, { message: "Sem permissão." });
    }

    return next();
  };
}

module.exports = { authorizeRoles };