// Connecting MongoDB Database
let mongoose= require('mongoose').default;
let dbConfig = require('./db');

mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.db).then(() => {
        console.log('Database successfully connected!')
    },
    error => {
        console.log('Could not connect to database : ' + error)
    }
)

module.exports = {
    mongoose
}