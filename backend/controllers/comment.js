const db = require('../models');
const fs = require('fs');

exports.createComment = (req, res, next) => {
        db.Comment.create({
            comment: req.body.comment, userId: req.body.userId, postId: req.body.postId
        })
        .then(() => res.status(201).json({ message: 'Commentaire crée !' }))
        .catch(error => res.status(400).json({ error: 'Création impossible' }));
    
}
 
exports.getAllComments = (req, res, next) => {
    db.Comment.findAll({
        where: {
            postId : req.params.postId,
            enabled: 1
        },
        order: [
            ['createdAt', 'DESC']
        ],
        include: [
          { model: db.User },
        ]
    })
        .then(comments => res.status(200).json(comments))
        .catch(error => res.status(404).json({ error }));
};

exports.getOneComment = (req, res, next) => {
     db.Comment.findOne({ 
            where: { 
             id: req.params.id 
            },
            include: [
                { model: db.User },
            ]
         })

        .then(comment => res.status(200).json(comment))
        .catch(error => res.status(404).json({ error }));
};

exports.modifyComment = (req, res, next) => { 
    db.Comment.findOne({ where : { id: req.params.id }})
    .then(comment => {
            db.Comment.update({ ...req.body },{ where : { id: req.params.id }})
                .then(() => res.status(200).json({ message: 'Commentaire modifié !'}))
                .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(500).json({ error }))
};


exports.deleteComment = (req, res, next) => {
    console.log(req.params.id)
    db.Comment.update(
            {
                enabled: 0
            },
            {
                where: {
                    id: req.params.id
                },
            }
        )
        .then(() => res.status(200).json({ message: 'Commentaire supprimé !'}))
        .catch(error => res.status(400).json({ error }))
};