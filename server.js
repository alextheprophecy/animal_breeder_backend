const dotenv = require("dotenv") //setting environment variables s.a. secret key
let express = require('express');
let cors = require('cors');
let bodyParser = require('body-parser');

dotenv.config()

const userRoute = require('./routes/animal.route')
const {getChild} = require("./controllers/animal.controller");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());

//routes
app.use('/animal', userRoute)

//404
app.use((req, res, next) => {
    res.status(404).send('Error 404!')
});
getChild(1, 2).then(o=>{console.log(o)})
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
    console.log('Connected to port ' + port)
})