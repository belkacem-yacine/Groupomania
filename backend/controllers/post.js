const db = require('../models');
const fs = require('fs');

exports.createPost = (req, res, next) => {
    console.log(req.body)
    const postObject = req.file ? 
    {
        ...JSON.parse(req.body.post),
        image_url: `${req.protocol}://${req.get('host')}/images/posts/${req.file.filename}`,
    } : { ...JSON.parse(req.body.post)};
        db.Post.create({
            ...postObject
        })
        .then(() => res.status(201).json({ message: 'Publication créee !' }))
        .catch(error => res.status(400).json({ error: 'Création impossible' }));
    
}

//exports.getAllPost = 

exports.getOnePost = (req, res, next) => {
    db.Post.findOne({ where: { id: req.params.id } }) // je sais pas si je dois utiliser req.body ou .params
        .then(user => res.status(200).json(user))
        .catch(error => res.status(404).json({ error }));
};

exports.modifyPost = (req, res, next) => {
    const userObject = req.file ? 
    {
        ...JSON.parse(req.body.post),
        image_url: `${req.protocol}://${req.get('host')}/images/posts/${req.file.filename}`,
    } : { ...JSON.parse(req.body.post)};
    db.Post.findOne({ where : { id: req.params.id }})
    .then( post => {
        const filename = post.image_url.split('/images/posts/')[1] //entre crochet le 1 cest pour acceder a un tableau 
        if(req.file) {
            fs.unlink(`images/posts/${filename}`, () => {
            });
          }   
            db.Post.updateOne({ where : { id: req.params.id }}, { ...postObject })
                .then(() => res.status(200).json({ message: 'Publication modifiée !'}))
                .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(500).json({ error }));
};

exports.deletPost = (req, res, next) => {
    db.Post.delete(

    )
                .then(() => res.status(200).json({ message: 'Publication supprimée !'}))
                .catch(error => res.status(400).json({ error }))
};