const express = require("express");
const router = express.Router();
const maxLoggin = require('../middleware/limit');


const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const userCtrl = require('../controllers/user');

router.post('/signup', multer.single('profil_image'), userCtrl.signup);
router.post('/login', maxLoggin.limiter, userCtrl.login);

router.get('/:id', userCtrl.getOneUser);
router.put('/modifyUser/:id', auth, multer.single('profil_image'), userCtrl.modifyUser);
router.put('/deleteUser/:id', auth, userCtrl.deleteUser);

module.exports = router