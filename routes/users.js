let express = require('express');
let router = express.Router();
let model = require("../models");
let url = require("url");
let fs = require('fs');
let multer = require('multer');
let path = require('path');
let requestHelper = require("../helpers/request");
let responseHelper = require("../helpers/response");
let url_parts;
let query;
let title;
let id;
let app = express();
let DIR = './public/uploads/';


let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
        let stamp = Date.now();
        cb(null, file_name);
    }
});

let upload = multer({storage: storage}).single('photo');

app.use('/static', express.static(path.join(__dirname, 'public')));

let net = require('net');
let Promise = require('bluebird');

router.get('/getAllArticles', function (req, res) {

    model.articles.findAll().then(function (article) {
        res.statusCode = 200;
        res.message = "success";
        res.json({"status": res.statusCode, "message": res.message, "data": article});
    }).catch(function (err) {
        res.statusCode = err.statusCode;
        res.message = err.message;
        res.json({"status": res.statusCode, "message": res.message, "data": null});
    })
});

router.get('/getArticleTitle', function (req, res, next) {
    url_parts = url.parse(req.url, true);
    query = url_parts.query;
    title = req.query.title;

    model.articles.find({where: {title: title}}).then(function (article) {
        if (article == null) {
            res.json({exist: false});
        }
        else {
            res.json({exist: true});
        }
    }), function (err) {
        console.log(err);
    }
});

router.get('/getArticleById', function (req, res) {
    url_parts = url.parse(req.url, true);
    query = url_parts.query;
    id = req.query.id;

    model.articles.find({where: {id: id}}).then(function (article) {
        res.json(article);

    });
});

router.post('/upload_image', function (req, res) {

    upload(req, res, function (err) {
        if (err) {
            res.json({statusCode: res.statusCode});
        }
    });

    res.json({status: res.statusCode});
});

router.post('/createArticle', function (req, res) {
    postBody = requestHelper.parseBody(req.body);

    model.articles.create({
        title: postBody.title,
        description: postBody.description,
        publishdate: postBody.publishdate,
        image: postBody.image
    });
    res.json(res.statusCode);

    file_name = postBody.image;
    console.log("Filename: " + file_name);
});

router.delete('/deleteArticle', function (req, res, err) {
    url_parts = url.parse(req.url, true);
    query = url_parts.query;
    id = req.query.id;

    if (err) {
        res.json({deleteInvalid: 'true'});
    }
    model.articles.destroy({where: {id: id}}).then(function (article) {
        res.json({deleteInvalid: 'false' + article});
    });
});

router.delete('/deleteImage', function (req, res, err) {
    url_parts = url.parse(req.url, true);
    query = url_parts.query;
    image = req.query.image;

    if (err) {
        res.json({deleteInvalid: 'true'});
    }

    let file_path = './public/uploads/' + image;
    fs.unlinkSync(file_path);
});

router.put('/updateArticle', function (req, res, err) {
    url_parts = url.parse(req.url, true);
    query = url_parts.query;
    id = req.query.id;

    if (err) {
        res.json({updateInvalid: 'true'});
    }

    model.articles.find({where: {id: id}}).then(function (article) {

        file_name = req.body.image;

        return article.updateAttributes({
            title: req.body.title,
            description: req.body.description,
            publishdate: req.body.publishdate,
            image: req.body.image
        }).then(function (article) {
            res.json(article);
        })
    })
});

module.exports = router;
