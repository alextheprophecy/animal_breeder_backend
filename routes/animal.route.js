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


router.post("/create", (req, res, next) => {
    const parents = req.body.parents
    console.log(parents)
    animalController.make_child(parents[0], parents[1]).then(animal_data_formatted=>
        res.send(animal_data_formatted)
    )
});

router.get("/all", (req, res, next) => {
    if(req.query.has_avatar){
        animalController.getAllAnimals({"has_avatar": req.query.has_avatar==='true'}).then(list => res.send(list))
    }else {
        animalController.getAllAnimals().then(list => res.send(list))
    }
});

router.get("/avatar", (req, res, next) => {
    const id = req.query.animal_id
    getAvatar(id).then(img => {
        console.log(img)
        res.send(img)
    })
});

module.exports = router;