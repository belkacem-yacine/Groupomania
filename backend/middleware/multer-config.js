const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        if (file.fieldname === "post_image") callback (null, "./images/posts/");
        else if (file.fieldname === "profil_image") callback (null, "./images/profils/");
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + path.extname(file.originalname));
    }
});

module.exports = multer({ storage });