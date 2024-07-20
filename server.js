const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require("dotenv") //setting environment variables s.a. secret key
dotenv.config()

//routes
const userRoute = require('./routes/animal.route')
//controllers
const mongoose_cont = require("./controllers/mongoose.controller")
const cloud_cont = require("./controllers/cloudinary.controller");
const animal_cont = require("./controllers/animal.controller");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());

app.use('/animal', userRoute)

//404
app.use((req, res, next) => {
    res.status(404).send('Error 404!')
});

const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
    console.log('Connected to port ' + port)
})