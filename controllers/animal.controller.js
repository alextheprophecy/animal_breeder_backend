const {queryProteus} = require("./stablediffusion.controller");
const {queryChatGPT, askGPTDescribeImage} = require("./chatgpt.controller");
const {AnimalModel} = require("../models/animal.model");
const {uploadAnimalImage} = require("./cloudinary.controller");
const {ObjectId} = require("mongodb");
const {removeImageBackground} = require("./image_processing.controller");

const SD_PROMPT_SUFFIX = "Be creative in blending these elements into the full body of a cohesive creature."
const SD_PROMPT_SUFFIX_2 = "Behind is a empty white background. Creative, assembled, logical, clear"

const animal_data_format = (is_new, animal_data) => {return {is_new: is_new, data: animal_data}}

const test_child = () => {
    const query = "A realistic sideview picture of an imaginary creature with the head of an eagle and the body of a tiger. The eagle's head features its sharp beak, piercing eyes, and majestic feathers, seamlessly blending into the powerful, striped body of a tiger, complete with muscular legs and a long tail."
    const query2 = "A realistic sideview picture of an imaginary creature with the legs of a spider, the head of a dog and a long black snake tail. The eight spider legs are thin and black, the dog face has cute eyes and a long dog snout, the tail is long, green and scaly"
    return make_child({sd_prompt: query2, parent_a:59,parent_b:58, id: 60}, {sd_prompt: query, parent_a:49, parent_b:48, id: 61})
}

const make_child = (id_a, id_b) => {
    return isCombinationNew(id_a, id_b).then(b=>{
        if(!b) return animal_data_format(false, getAnimalData())
        console.log("new Animal")
        return Promise.all([getAnimalData(id_a), getAnimalData(id_b)]).then(parents =>
            _make_animal(parents[0], parents[1])
        )
    })
}

const _make_animal = (parent_a_data, parent_b_data) => {
    [parent_a_data, parent_b_data] = orderParents(parent_a_data, parent_b_data)
    if (!isAnimalValid(parent_a_data) || !isAnimalValid(parent_b_data)) throw new Error("given parents are not valid Animals")

    const prompt_additions = ''// 'Add an extra random mutation body part or colour. '

    const gptPrompt2 = 'Here are the prompts for a standard diffusion model for the two fictional creature parents, ' +
        'write only the similar prompt for the child combination of the two parents, only describing the creature, not the background. ' +
        prompt_additions+
        ` 1.${parent_a_data.sd_prompt}, 2.${parent_b_data.sd_prompt}`

    return queryChatGPT(gptPrompt2).then(sd_prompt => {
        const sd_prompt_complete = sd_prompt + SD_PROMPT_SUFFIX + SD_PROMPT_SUFFIX_2
        const new_animal_data = {name: "test", sd_prompt: sd_prompt.toString(), parent_a: parent_a_data.id, parent_b: parent_b_data.id}

        return queryProteus(sd_prompt_complete, {outputs: 1}).then(image=>
            _saveAnimal(image, new_animal_data).then(g => {
                console.log("SUCCESS!: " + g)
                return animal_data_format(true, new_animal_data)
            })
        )
    })
}
const isCombinationNew = (parent_a_id, parent_b_id) => {
    [parent_a_id, parent_b_id] = orderParents(parent_a_id, parent_b_id)
    return AnimalModel.find({parent_a: parent_a_id, parent_b: parent_b_id}).then(a=> a.length===0)
}
const orderParents=(p_a, p_b)=> p_a>p_b ? [p_b, p_a] : [p_a, p_b]
const isAnimalValid = (animalData) => {
    return animalData.sd_prompt && animalData.parent_a && animalData.parent_b
}
const getAnimalData = (id) => {
    return AnimalModel.findOne({id: id}).exec()
}
const getAllAnimals = (query={}) => {
    console.log(query)
    return AnimalModel.find(query).then(res => res.map(a => [a.image, a.id]))
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
            //TODO: promise.all, with image data istead of url
            Promise.resolve(
                askGPTDescribeImage(url).on("functionCall", (params) => {
                    const data = JSON.parse(params.arguments)
                    console.log("got description!!: ", JSON.stringify(data))
                    AnimalModel.findByIdAndUpdate(new ObjectId(a._id), {image: url, name: data.name,
                        info:{ behaviour: data.behaviour, maxAge: data.maxAge, hunger: data.hunger}}).exec()
                })
            ))
    ).catch(console.log)
}

const getAvatar = (animalId) => {
    return getAnimalData(animalId).then( data => {
        if(!data.has_avatar){
            console.log(data.image)
            return removeImageBackground(data.image).then(img => _saveAvatar(img, animalId).then(a=>a))
        } else return data.image
    })
}

const _saveAvatar = (avatarImage, animalId) => {
    return AnimalModel.findOneAndUpdate({id: animalId}, {has_avatar: true}).then(() =>
        uploadAnimalImage(avatarImage, animalId, true)
    )
}


module.exports = {
    getAnimalData,
    getAvatar,
    make_child,
    test_child,
    getAllAnimals
}

