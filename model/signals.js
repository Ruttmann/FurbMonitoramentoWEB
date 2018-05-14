module.exports = function() {
    let db = require('./../libs/connect_db')()
    let mongoose = require('mongoose')

    // let arduino = mongoose.Schema({
    //     id: String,
    //     description: String,
    //     signals: [String]
    // })

    let signals = mongoose.Schema({
        signal_Id: String,
        signal1: [String],
        signal2: [String]
    })

    return mongoose.model('signals', signals)
}