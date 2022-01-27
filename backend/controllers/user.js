const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');
const fs = require('fs');

exports.signup = (req, res, next) => {
    const userObject = req.file ? 
    {
        ...JSON.parse(req.body.user),
        image_url: `${req.protocol}://${req.get('host')}/images/profils/${req.file.filename}`,
    } : { ...JSON.parse(req.body.user)};
    bcrypt.hash(userObject.password, 10)
    .then(hash => {
        let image_url = null // ptre le laisser vide
        if(req.file) {
            image_url = `${req.protocol}://${req.get('host')}/images/profils/${req.file.filename}`
        }
        db.User.create({
            email: userObject.email,
            password: hash,
            firstName: userObject.firstName,
            lastName: userObject.lastName,
            image_url
        })
        .then(() => res.status(201).json({ message: 'Utilisateur crée !' }))
        .catch(error => res.status(400).json({ error: 'Création impossible' }));
    })
    .catch(error => res.status(500).json({ error: 'erreur serveur' }));
}

exports.login = (req, res, next) => {
    db.User.findOne({ where: { email: req.body.email } })
    .then(user => {
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé !'})
        }
        if(user.enabled == 0) {
            return res.status(400).json({ error: 'Compte desactivé !'})
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

exports.getOneUser = (req, res, next) => {
    db.User.findOne({ where: { id: req.params.id } }) // je sais pas si je dois utiliser req.body ou .params
        .then(user => res.status(200).json(user))
        .catch(error => res.status(404).json({ error }));
};

exports.modifyUser = (req, res, next) => {
    const userObject = req.file ? 
    {
        ...JSON.parse(req.body.user),
        image_url: `${req.protocol}://${req.get('host')}/images/profils/${req.file.filename}`,
    } : { ...JSON.parse(req.body.user)};
    db.User.findOne({ where : { id: req.params.id }})
    .then( user => {
        const filename = user.image_url.split('/images/profils/')[1] //entre crochet le 1 cest pour acceder a un tableau 
        if(req.file) {
            fs.unlink(`images/profils/${filename}`, /*() => {
            }*/); // si ca marche pas decommenter ici
          }   
            db.User.updateOne({ where : { id: req.params.id }}, { ...userObject })
                .then(() => res.status(200).json({ message: 'Profil modifié !'}))
                .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(500).json({ error }));
};

exports.deleteUser = (req, res, next) => {
    db.User.updateOne({ where : { id: req.params.id }}, { enabled: 0 })
                .then(() => res.status(200).json({ message: 'Compte désactivé !'}))
                .catch(error => res.status(400).json({ error }))
};