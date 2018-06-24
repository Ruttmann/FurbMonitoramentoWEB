let mongoose = require('mongoose')
let db

module.exports = function() {
    if (!db) {
        if (process.env.MONGODB_URI == undefined) {
            console.log("DEVELOPMENT DB")
            db = mongoose.connect('mongodb://localhost/arduino')
        } else {
            console.log("PRODUCTION DB")
            db = mongoose.connect(process.env.MONGODB_URI)
        }
    }
    return db
}