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
        order: [
            ['createdAt', 'DESC']
        ],
        include: [
          { model: db.User },
          { model: db.Post }
        ]
    })
        .then(comments => res.status(200).json(comments))
        .catch(error => res.status(404).json({ error }));
};

exports.getOneComment = (req, res, next) => {
    db.Comment.findOne({ where: { id: req.params.id } })
        .then(comment => res.status(200).json(comment))
        .catch(error => res.status(404).json({ error }));
};

/*exports.modifyComment = (req, res, next) => {
    const commentObject = req.file ? 
    {
        ...JSON.parse(req.body.comment),
        image_url: `${req.protocol}://${req.get('host')}/images/posts/${req.file.filename}`,
    } : { ...JSON.parse(req.body.post)};
    db.Comment.findOne({ where : { id: req.params.id }})
    .then( comment => {
        const filename = post.image_url.split('/images/posts/')[1] //entre crochet le 1 cest pour acceder a un tableau 
        if(req.file) {
            fs.unlink(`images/posts/${filename}`, () => {
            });
          }
            db.Comment.updateOne({ where : { id: req.params.id }}, { ...commentObject })
                .then(() => res.status(200).json({ message: 'Commentaire modifié !'}))
                .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(500).json({ error }));
};*/

/*exports.modifyComment = (req, res, next) => {
    const commentObject = req.file ? 
    db.Comment.findOne({ where : { id: req.params.id }})
    comment() => {
            db.Comment.updateOne({ where : { id: req.params.id }}, { ...commentObject })
                .then(() => res.status(200).json({ message: 'Commentaire modifié !'}))
                .catch(error => res.status(400).json({ error }))
    }

};*/


exports.deleteComment = (req, res, next) => {
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