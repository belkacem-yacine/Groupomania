const express = require("express");
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const postCtrl = require('../controllers/post');

router.post('/createPost', multer.single('profil_image'), postCtrl.createPost);

/*router.get('/:id', userCtrl.getOneUser);
router.put('/modifyUser/:id', auth, multer.single('profil_image'), userCtrl.modifyUser);
router.put('/deleteUser/:id', auth, userCtrl.deleteUser);*/

module.exports = router