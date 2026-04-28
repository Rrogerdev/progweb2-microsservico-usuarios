module.exports = function notFound(req, res, next){
    res.send(404, {error: "Rota não encontrada."});
};