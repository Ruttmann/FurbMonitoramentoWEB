module.exports = function() {
    let db = require('./../libs/connect_db')()
    let mongoose = require('mongoose')

    let signals = mongoose.Schema({
        deviceName: { type: String, default: 'Fill a device name' },
        description: { type: String, default: `Device added on ${new Date().toDateString()}` },
        signal: [String]
    })

    return mongoose.model('signals', signals)
}