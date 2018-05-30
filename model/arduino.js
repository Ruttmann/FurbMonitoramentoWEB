module.exports = function() {
    let db = require('./../libs/connect_db')()
    let mongoose = require('mongoose')

    let arduino = mongoose.Schema({
        device_Id: String,
        description: { type: String, default: 'Fill a description for the device.' },
        signalKeys: [String]
    })

    return mongoose.model('arduino', arduino)
}