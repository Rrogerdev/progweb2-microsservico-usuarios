module.exports = function errorHandler(err, req, res, next){
    // console.error("Erro", err);

    const status = err.statusCode || 500;

    res.status(status).json({
        error: status === 500 ? "Erro interno no servidor." : err.message,
        details: err.details ?? null
    });
};