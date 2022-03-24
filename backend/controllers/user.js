const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');
const fs = require('fs');
const dbConfig = require('../config/db.config');

exports.signup = (req, res, next) => {
    const userObject = req.file ? 
    {
        ...JSON.parse(req.body.user),
        image_url: `${req.protocol}://${req.get('host')}/images/profils/${req.file.filename}`,
    } : { ...JSON.parse(req.body.user)};

    db.User.findOne( { where: { email: userObject.email }})
        .then(
            user => {
                if(!user) {
                   bcrypt.hash(userObject.password, 10)
                    .then(hash => {
                        userObject.password = hash;
                        db.User.create({
                            ...userObject
                        })
                        .then(() => res.status(201).json({ message: 'Utilisateur crée !' }))
                        .catch(error => res.status(400).json({ error: 'Création impossible' }));
                    })
                    .catch(error => res.status(500).json({ error: 'erreur serveur' })); 
                } else {
                    fs.unlink(`images/profils/${req.file.filename}`, () => {});
                    return res.status (400).json({error: 'Email déjà utilisé'})
                }
            } 
        )
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
    db.User.findOne({ where: { id: req.params.id } })
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
        if((userObject.admin == true || userObject.admin == "true") && userObject.adminPassword != dbConfig.ADMIN_PASSWORD) {
            return res.status(400).json({ error : 'Mot de passe administrateur incorrect !'});
        } else {
        const filename = user.image_url.split('/images/profils/')[1];
        if(req.file) {
            fs.unlink(`images/profils/${filename}`, () => {});
          }
            db.User.update( { ...userObject }, { where : { id: req.params.id }},)
                .then(() => res.status(200).json({ message: 'Profil modifié !'}))
                .catch(error => res.status(400).json({ error }))
        }
    })
    .catch(error => res.status(500).json({ error }));
};

exports.deleteUser = (req, res, next) => {
    db.User.update(
        {
         enabled: 0
        },
        {
           where: {
              id: req.params.id,
           },
        }
     )
                .then(() => res.status(200).json({ message: 'Compte désactivé !'}))
                .catch(error => res.status(400).json({ error }))
};