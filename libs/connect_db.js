var mongoose = require('mongoose');
var db;

module.exports = function() {
    if (!db) {
        db = mongoose.connect('mongodb://localhost/arduino');
        // db.on('error', console.log("Erro de conexão ao banco de dados!"));
    }
    return db;
}