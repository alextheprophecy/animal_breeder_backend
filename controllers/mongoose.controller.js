let mongoose= require('mongoose').default;
const dotenv = require("dotenv");
dotenv.config()

const URI = `mongodb+srv://alexandrebourgoin23:${encodeURIComponent(process.env.MONGO_PASSWORD)}@cluster0.nikyyed.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.Promise = global.Promise;
mongoose.connect(URI).then(() => {
        console.log('Database successfully connected!')
    },
    error => {
        console.log('Could not connect to database : ' + error)
    }
)

module.exports = {
    mongoose
}