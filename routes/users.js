let express = require('express');
let router = express.Router();
let  model = require("../models");
let url = require("url");
let fs = require('fs');
let multer = require('multer');
let path = require('path');
let requestHelper = require("../helpers/request");
let responseHelper = require("../helpers/response");


router.get('/', function(req, res) {
return res.json({
    name: "sumaiya"
});
});

router.get('/getAllArticles', function (req, res, next) {
    model.articles.findAll().then(function (article) {
        res.json(article);
    })
});



router.post('/createArticle', function (req, res) {
   postBody = requestHelper.parseBody(req.body);
    const tempPath = postBody.image.getPat;

    let image = __dirname +'\\' + postBody.image;

    // return res.json({tempPath: tempPath});
    fs.rename(postBody.image, image, function(err) {
        if (err) {
            console.log(err);
            res.json({error:'error'});
        } else {
            res.json({
                message: 'File uploaded successfully',
                filename: req.image});

        }
    });

    model.articles.create({
        title: postBody.title,
        description: postBody.description,
        publishdate: postBody.publishdate,
        image: postBody.image,
   });

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
  }
);

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

module.exports = router;
