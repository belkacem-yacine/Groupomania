const express = require("express");
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const postCtrl = require('../controllers/post');

router.post('/createPost', auth, multer.single('post_image'), postCtrl.createPost);

/*router.get('/:id', postCtrl.getOnePost);
router.put('/modifyPost/:id', auth, multer.single('profil_image'), postCtrl.modifyPost);
router.delete('/deletePost/:id', auth, postCtrl.deletePost);*/

module.exports = router