function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Não autenticado." });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Sem permissão." });
    }

    return next();
  };
}

module.exports = { authorizeRoles };