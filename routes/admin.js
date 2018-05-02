var express = require('express');
var router = express.Router();
// var model = require('./../model/arduino')();

router.get('/', function(req, res, next) {
    res.render('admin', { title: 'Monitoramento PDGe4'});
    // model.find(null, function(err, data) {
    //     if (err) {
    //         throw err;
    //     }
    // });
});

//TODO: não funciona, dá 404!
// router.post('/add', function(req, res, next) {
//     var body = req.body;
//     body.status = false;
//     model.create(body, function(err, data) {
//         if (err) {
//             throw err;
//         }
//         res.redirect('/admin');
//     })
//   });

module.exports = router;