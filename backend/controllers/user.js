const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');
const fs = require('fs');

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
}

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

module.exports.getOneUser = (req, res, next) => {
    console.log(req.params)
    db.User.findOne({ where: { id: req.params.id } }) // je sais pas si je dois utiliser req.body ou .params
        .then(user => res.status(200).json(user))
        .catch(error => res.status(404).json({ error }));
};

module.exports.modifyUser = (req, res, next) => {
    const userObject = req.file ? 
    {
        ...JSON.parse(req.body.user),
        image_url: `${req.protocol}://${req.get('host')}/images/profils/${req.file.filename}`,
    } : { ...req.body };
    db.User.findOne({ where : { id: req.params.id }})
    .then( user => {
        const filename = user.image_url.split('/images/profils/')[1] //je me souviens plus a quoi sert le chiffre entre crochet
        fs.unlink(`images/profils/${filename}`, () => {
            user.updateOne({ where : { id: req.params.id }}, { id: req.params.id })
                .then(() => res.status(200).json({ message: 'Profil modifié !'}))
                .catch(error => res.status(400).json({ error }))
        });
    })
    .catch(error => res.status(500).json({ error }));
};

module.exports.deleteUser = (req, res, next) => {
    db.User.findOne({ where: { id: req.params.id }})
        .then(user => { 
            const filename = user.image_url.split('/images/profils/')[1];
            fs.unlink(`images/profils/${filename}`, () => {
                user.deleteOne({ where : { id: req.params.id }})
                    .then(() => res.status(200).json({ message : 'Utilisateur supprimé ! '}))
                    .catch(error => res.status(400).json({ error}));
            });
        })
        .catch(error => res.status(500).json({ error }))
};