module.exports = function() {
    let db = require('./../libs/connect_db')()
    let mongoose = require('mongoose')

    let arduino = mongoose.Schema({
        clientID: String,
        description: { type: String, default: 'Preencha uma descrição.' },
        signalKeys: [String],
        //isOnline: { type: Boolean, default: true },
        hasFailure: { type: String, default: 'Não' }
    })

    return mongoose.model('arduino', arduino)
}