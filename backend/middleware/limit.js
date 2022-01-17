const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 3,
    message: 'Trop de tentatives de connexion. Compte bloqué pour 2 minutes'
});

module.exports = { limiter};