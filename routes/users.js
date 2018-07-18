let express = require('express');
let router = express.Router();
let  model = require("../models");
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
    filename: function(req, file, cb){
        let stamp = Date.now();

        let name = file.originalname.split('.');
        console.log("Name:  "+name[0]);
        // let file_name  = name[0]  + '-' + stamp + '.' + name[1];
        cb(null, file_name);
     }
});


let upload = multer({storage: storage}).single('photo');

app.use('/static', express.static(path.join(__dirname, 'public')));

router.get('/getAllArticles', function (req, res) {
    model.articles.findAll().then(function (article) {
        res.json(article);
    })
});


// function onFileUploadComplete(file){
//     file_image = file;
    // }

router.get('/getArticleTitle', function(req, res){
    url_parts = url.parse(req.url, true);
    query = url_parts.query;
    title = req.query.title;

    model.articles.find({where: {title: title}}).then(function(article){
       if(article == null){
           res.json({exist: false});
       }
       else{
           res.json({exist: true});
       }
    })
});

router.get('/getArticleById',function(req, res) {
    url_parts = url.parse(req.url, true);
    query = url_parts.query;
    id = req.query.id;

    model.articles.find({where: {id: id}}).then(function (article) {
        res.json(article);

    });
});

router.post('/upload_image', function(req, res) {
    let path = '';
    upload(req, res, function (err) {
        if (err) {
            console.log(err);
        }
        });
    // path = req.file.path;
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
    console.log("Filename: "+file_name);
});

router.delete('/deleteArticle', function (req, res, err) {
   url_parts = url.parse(req.url, true);
   query = url_parts.query;
   id = req.query.id;

   if(err){
   res.json({deleteInvalid : 'true'});
   }
   model.articles.destroy({where: {id: id}}).then(function (article){
           res.json({deleteInvalid: 'false'+article});
   });
  });

router.delete('/deleteImage', function (req, res, err) {
    url_parts = url.parse(req.url, true);
    query = url_parts.query;
    image = req.query.image;

    if(err){
        res.json({deleteInvalid : 'true'});
    }

    let file_path = './public/uploads/'+image;
    fs.unlinkSync(file_path);
});

router.put('/updateArticle', function (req, res, err) {
   url_parts = url.parse(req.url, true);
   query = url_parts.query;
   id = req.query.id;

   if(err){
     res.json({updateInvalid: 'true'});
   }

   model.articles.find({where: {id : id}}).then(function (article) {
       return article.updateAttributes({title: req.body.title,
           description : req.body.description,
           publishdate: req.body.publishdate,
           image: req.body.image}).then(function(article){
           res.json(article);
       })
   })
});

router.put('/updateImage', function (req, res, err) {
    url_parts = url.parse(req.url, true);
    query = url_parts.query;
    new_image = req.query.new_image;
    prev_image = req.query.prev_image;

    if(err){
        res.json({updateInvalid: 'true'});
    }

});


module.exports = router;
