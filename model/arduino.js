module.exports = function() {
    let db = require('./../libs/connect_db')()
    let mongoose = require('mongoose')

    // let arduino = mongoose.Schema({
    //     id: String,
    //     description: String,
    //     signals: [String]
    // })

    let arduino = mongoose.Schema({
        device_Id: String,
        description: String,
        signal1_Id: String,
        signal2_Id: String
    })

    return mongoose.model('arduino', arduino)
}