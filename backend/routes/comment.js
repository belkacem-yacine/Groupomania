const express = require("express");
const router = express.Router();

const auth = require('../middleware/auth');
const commentCtrl = require('../controllers/comment');

router.post('/createComment', auth, commentCtrl.createComment);
router.get('/:postId', auth, commentCtrl.getAllComments);
//router.get('/:id', auth, commentCtrl.getOneComment);
/*router.put('/modifyComment/:id', auth, commentCtrl.modifyComment);
router.put('/deleteComment/:id', auth, commentCtrl.deleteComment);*/

module.exports = router