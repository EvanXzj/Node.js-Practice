var express = require('express');
var router = express.Router();

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var photos=require('./photos');//new one

/* GET home page. */
router.get('/', photos.listPhoto);

router.get('/upload',photos.form);

router.post('/upload',multipartMiddleware,photos.submit('./public/photos'));

router.get('/photo/:id/download',photos.download('./public/photos'));

module.exports = router;
