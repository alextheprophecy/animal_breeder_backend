const {queryProteus} = require("./stablediffusion.controller");
const {queryChatGPT} = require("./chatgpt.controller");
const {AnimalModel} = require("../models/animal.model");
const {uploadAnimalImage} = require("./cloudinary.controller");
const {ObjectId} = require("mongodb");
const query = "A realistic sideview picture of an imaginary creature with the head of an eagle and the body of a tiger. The eagle's head features its sharp beak, piercing eyes, and majestic feathers, seamlessly blending into the powerful, striped body of a tiger, complete with muscular legs and a long tail."
const query2 = "A realistic sideview picture of an imaginary creature with the legs of a spider, the head of a dog and a long black snake tail. The eight spider legs are thin and black, the dog face has cute eyes and a long dog snout, the tail is long, green and scaly"

const sd_prompt_suffix_2 = "Be creative in blending these elements into a cohesive creature."
const sd_prompt_suffix = " Behind is a blank white background."

const test_child = () => {
    return makeChild({sd_prompt: query2, parent_a:59,parent_b:58, id: 60}, {sd_prompt: query, parent_a:49, parent_b:48, id: 61})
}

const make_child = (id_a, id_b) => {
    return _make_animal(getAnimalData(id_a), getAnimalData(id_b))
}

const _make_animal = (parent_a_data, parent_b_data) => {
    if (!isAnimalValid(parent_a_data) || !isAnimalValid(parent_b_data)) throw new Error("given parents are not valid Animals")

    const gptPrompt2 = 'Here are the prompts for a standard diffusion model for the two fictional creature parents, ' +
        'write only the similar prompt for the child of these two creatures, only describing the creature, not the environment or background.' +
        `1. ${parent_a_data.sd_prompt}, 2. ${parent_b_data.sd_prompt}`

    return queryChatGPT(gptPrompt2).then(sd_prompt => {
        const sd_prompt_complete = sd_prompt + sd_prompt_suffix
        const new_animal_data = {name: "test", sd_prompt: sd_prompt.toString(), parent_a: parent_a_data.id, parent_b: parent_b_data.id}
        return queryProteus(sd_prompt_complete, {outputs: 1}).then(image=>
            _saveAnimal(image, new_animal_data).then(g => {
                console.log("SUCCESS!: " + g)
                return new_animal_data
            })
        )
    })
}

const isAnimalValid = (animalData) => {
    return animalData.sd_prompt && animalData.parent_a && animalData.parent_b
}


const getAnimalData = (id) => {
    return AnimalModel.findOne({id: id}).exec()
}
/**
 * stores animal data in database, uploads image to cloudinary, saves image URL in database
 * @param image
 * @param animalData
 * @private
 */
const _saveAnimal = (image, animalData) => {
    return AnimalModel.create(animalData).then(a=>
        uploadAnimalImage(image, a.id).then(url =>
            AnimalModel.findByIdAndUpdate(new ObjectId(a._id), {image: url}).exec()
        )
    ).catch(console.log)
}


module.exports = {
    _saveAnimal,
    getAnimalData,
    makeChild,
    test_child
}

