var express = require('express');
var request = require('request');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var formidable = require('formidable');
var validator = require('validator');
var randomstring = require('randomstring');
var jade = require('jade');
var mongodb = require('mongodb');
var UrlSafeString = require('url-safe-string');

let uploadDir = process.env.UPLOADS_DIR;



router.get('/', function(req, res, next) {
  res.render('add_vacancy', {});
});

router.post('/', function(req, res, next) {
  let safeUrl = new UrlSafeString();

  let form = new formidable({
    keepExtensions: true,
    maxFileSize: 2 * 1024 * 1024 // 2 Mb
  });

  form.parse(req, (err, fields, files) => {
    if(err) {
      console.log('ERROR', err);
      req.redirect('back');
      return;
    }

    let logo = files['company.img'];

    if(logo && logo.size > 0) {
      let newName = `${randomstring.generate()}${path.extname(logo.name)}`;
      newName = path.join(uploadDir, newName);

      fs.rename(logo.path, newName, (err2) => {
        if(err2) {
          next(err2);
        }

        if(typeof fields['vacancy.text'] === 'string') {
          fields['vacancy.text'] = fields['vacancy.text'].replace(/\r/, '');
        }

        req.db.collection('vacancies').insert({
          url: safeUrl.generate(fields.url),
          vacancy: {
            title: fields['vacancy.title'],
            text: fields['vacancy.text']
          },
          company: {
            img: newName,
            desc: fields['company.desc'],
            link: fields['company.link'],
            href: fields['company.href']
          },
        })
        .then(res2 => {
          console.log('NEW VACANCY', res2);
          res.redirect('#callback');
        })
        .catch(err2 => {
          next(err2);
        });

      });
    }
  });
});


router.get('/:vac_id', function(req, res, next) {
  let id = req.params.vac_id;

  req.db.collection('vacancies').findOne({url: id})
    .then(res2 => {
      if(!res) {
        throw new Error('NO_VACANCY');
      }
      res2.vacancy.id = res2._id;
      res2.vacancy.text = jade.render(res2.vacancy.text || '', {pretty:true});
      res.render('vacancy', res2);
    })
    .catch(err2 => {
      next(err2);
    });
});

router.post('/:vac_id', function(req, res, next) {
  let id = req.params.vac_id;

  let form = new formidable({
    keepExtensions: true,
    maxFileSize: 20 * 1024 * 1024 // 20 mB
  });

  req.db.collection('vacancies').findOne({url: id})
    .then(res4 => {
      if(!res4) {
        throw new Error('NO_VACANCY');
      }

      form.parse(req, (err, fields, files) => {
        if(err) {
          next(err);
        }
        if(!fields || fields.send !== 'send') {
          next();
        }
        let cv = files.cv;

        // CV
        if(cv && cv.size > 0) {
          let newName = `${randomstring.generate()}${path.extname(cv.name)}`;
          newName = path.join(uploadDir, newName);

          fs.rename(cv.path, newName, (err2) => {
            if(err2) {
              next(err2);
            }

            req.db.collection('cvs').insert({
              vacancy: res4._id,
              file: newName,
              date: new Date()
            })
            .then(res2 => {
              console.log('CV SAVED', res2);
              return res.redirect('#callback');
            })
            .catch(err3 => {
              next(err3);
            });
          });
        }
        // no CV
        else {
          // no email
          if(!fields.email || !validator.isEmail(fields.email)) {
            next(new Error('ERR_NO_CV_AND_EMAIL'));
          }

          let f = {
            vacancy: res4._id,
            email: fields.email,
            fio  : fields.fio   || null,
            phone: fields.phone || null,
            link : fields.link  || null,
            socs : fields.socs  || null,
            date : new Date()
          };

          req.db.collection('forms').insert(f)
          .then(res2 => {
            console.log('FORM SAVED', res2);
            return res.redirect('#callback');
          })
          .catch(err2 => {
            next(err2);
          });
        }
    })
    .catch(err4 => {
      next(err4);
    });


  });
});

module.exports = router;
