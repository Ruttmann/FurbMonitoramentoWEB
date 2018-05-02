module.exports = function() {
    var db = require('./../libs/connect_db')();
    var mongoose = require('mongoose');

    var arduino = mongoose.Schema({
        id: String,
        description: String,
        signals: [String]
    });

    return mongoose.model('arduino', arduino);
}