var express = require('express');
var request = require('request');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var formidable = require('formidable');
var validator = require('validator');
var randomstring = require('randomstring');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {  });
});

router.post('/', function(req, res, next) {
  console.log('Callback');
  let form = new formidable({
    keepExtensions: true,
    maxFileSize: 20 * 1024 * 1024 // 20 Mb
  });

  form.parse(req, (err, fields, files) => {
    if(err) {
      res.redirect('back');
      return;
    }

    let email = fields ? fields.email : '';

    if(typeof email !== 'string' || !validator.isEmail(email)) {
      res.redirect('back');
      return;
    }

    req.db.collection('callbacks').insert({
      email: email,
      date: new Date()
    })
    .then(res2 => {
      console.log('CALLBACK', res2);
      res.redirect('#callback');
    })
    .catch(err2 => {
      next(err2);
    });
  });
});

module.exports = router;
