module.exports = function() {
    let db = require('./../libs/connect_db')()
    let mongoose = require('mongoose')

    let arduino = mongoose.Schema({
        device_Id: String,
        description: String,
        signalKeys: [String]
    })

    return mongoose.model('arduino', arduino)
}