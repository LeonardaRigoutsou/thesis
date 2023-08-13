const express = require('express');
const multer = require('multer');
const imagecontroller = require('../controllers/imagecontroller');

const uploader = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'images');
        },
        filename: (req, file, cb) => {
            if (req.query.type === 'logo') {
                cb(null, 'logo.png');
            } else if (req.query.type === 'table') {
                cb(null, 'table.png');
            } else {
                cb(null, '');
            }
        }
    })
});

const router = express.Router();

router.post('/upload', uploader.single('file'), imagecontroller.upload);

module.exports = router;