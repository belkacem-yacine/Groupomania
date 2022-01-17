const express = require("express");
const router = express.Router();
const maxLoggin = require('../middleware/limit');

const multer = require('../middleware/multer-config');
const userCtrl = require('../controllers/user');

router.post('/signup', multer.single('profil_image'), userCtrl.signup);
router.post('/login', maxLoggin.limiter, userCtrl.login);

module.exports = router