const Replicate = require("replicate")

let express = require("express"),
    router = express.Router();
const animalController = require("../controllers/animal.controller");

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN, // defaults to process.env.REPLICATE_API_TOKEN
});


router.post("/create", (req, res, next) => {
    animalController()

});

router.get("/add", (req, res, next) => {
    res.send("done!")
});

module.exports = router;