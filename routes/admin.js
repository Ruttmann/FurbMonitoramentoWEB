let express = require('express')
let router = express.Router()
// let model = require('./../model/arduino')()

router.get('/', function(req, res, next) {
    res.render('admin', { title: 'Monitoramento PDGe4'})
})

module.exports = router