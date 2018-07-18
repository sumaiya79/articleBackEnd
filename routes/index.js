let express = require('express');
let router = express.Router();
let multer = require('multer');
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});



module.exports = router;
