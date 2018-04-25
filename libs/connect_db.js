var mongoose = require('mongoose');
var db;

module.exports = function() {
    if (!db) {
        db = mongoose.connect('mongodb://localhost/arduino');
    }
    return db;
}