let express = require('express')
let router = express.Router()
// let model = require('./../model/arduino')()

router.get('/', function(req, res, next) {
    res.render('admin', { title: 'Monitoramento PDGe4'})
    // res.render('boottest')
    // model.find(null, function(err, data) {
    //     if (err) {
    //         throw err
    //     }
    // })
})

//TODO: não funciona, dá 404!
// router.post('/add', function(req, res, next) {
//     let body = req.body
//     body.status = false
//     model.create(body, function(err, data) {
//         if (err) {
//             throw err
//         }
//         res.redirect('/admin')
//     })
//   })

module.exports = router