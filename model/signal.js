module.exports = function() {
    let db = require('./../libs/connect_db')()
    let mongoose = require('mongoose')

    let signals = mongoose.Schema({
        deviceName: { type: String, default: 'Preencha a marca/modelo do equipamento.' },
        description: String,
        signal: [String]
    })

    return mongoose.model('signals', signals)
}