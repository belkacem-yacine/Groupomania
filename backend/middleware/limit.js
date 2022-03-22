const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 5,
    message: 'Trop de tentatives de connexion. Compte bloqué pour 1 minute'
});

module.exports = { limiter};