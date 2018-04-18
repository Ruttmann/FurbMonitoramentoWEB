var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('admin', { title: 'Monitoramento PDGe4'});
});

module.exports = router;