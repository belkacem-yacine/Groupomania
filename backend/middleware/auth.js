const jwt = require('jsonwebtoken');
const db = require('../models');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization; 
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        db.User.findOne({ where: {id: userId} })
            .then(user => {
                if(!user) {
                    throw 'User ID non valable!'
                }else{
                    next();
                }
            })
    } catch (error) {
        res.status(401).json({ error: 'Requête non authentifiée !'})
    }
};