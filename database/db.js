const dotenv = require("dotenv");
dotenv.config()

module.exports = {
    db:`mongodb+srv://alexandrebourgoin23:${encodeURIComponent(process.env.MONGO_PASSWORD)}@cluster0.nikyyed.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
}
