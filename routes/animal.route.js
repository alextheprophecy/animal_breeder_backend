const Replicate = require("replicate")

let express = require("express"),
    router = express.Router();
const animalController = require("../controllers/animal.controller");
const {avatarise_animal} = require("../controllers/image_processing.controller");
const {uploadAnimalImage} = require("../controllers/cloudinary.controller");
const {getAvatar} = require("../controllers/animal.controller");

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN, // defaults to process.env.REPLICATE_API_TOKEN
});


router.get("/create", (req, res, next) => {
    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Transfer-Encoding': 'chunked'
    });
    res.write("Creating a new Animal!");
    const parents = req.query.parents
    console.log("PARENTS:",parents)
    animalController.make_child(parents[0], parents[1], res).then(animal_data_formatted => {
        res.write(JSON.stringify(animal_data_formatted))
        res.end()
    })
});

router.get("/stream", (req, res) => {
    console.log("YEsp")
    res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Transfer-Encoding': 'chunked'
    });

    console.log("YEsp")

    res.write("Thinking...");
    sendAndSleep(res, 1);
})


const sendAndSleep = function (response, counter) {
    if (counter > 3) {
        response.write("over!");
        response.end()
        response.send
    } else {
        response.write(" ;i=" + counter);
        counter++;
        setTimeout(function () {
            sendAndSleep(response, counter);
        }, 1000)
    }
}


router.get("/all", (req, res, next) => {
    if(req.query.has_avatar)
        animalController.getAllAnimals({"has_avatar": req.query.has_avatar==='true'}).then(list => res.send(list))
    else
        animalController.getAllAnimals().then(list => res.send(list))
});

module.exports = router;