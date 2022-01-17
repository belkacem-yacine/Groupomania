const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');

exports.signup = (req, res, next) => {
    const userObject = JSON.parse(req.body.user)
    console.log(userObject)
    bcrypt.hash(userObject.password, 10)
    .then(hash => {
        db.User.create({
            email: userObject.email,
            password: hash,
            firstName: userObject.firstName,
            lastName: userObject.lastName,
            image_url: `${req.protocol}://${req.get('host')}/images/profils/${req.file.filename}`,
        })
        .then(() => res.status(201).json({ message: 'Utilisateur crée !' }))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));

};

exports.login = (req, res, next) => {
    db.User.findOne({ where: { email: req.body.email } })
    .then(user => {
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé !'})
        }
        bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid) {
                    return res.status(400).json({ error: 'Mot de passe incorrect !'});
                }
                res.status(200).json({
                    userId: user.id, 
                    token: jwt.sign(
                        { userId: user.id},
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn: '24h'}
                    )
                });
            })
            .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};