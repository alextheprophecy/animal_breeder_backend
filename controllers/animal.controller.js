const {queryProteus} = require("./stablediffusion.controller");
const {queryChatGPT, askGPTDescribeImage} = require("./chatgpt.controller");
const {AnimalModel} = require("../models/animal.model");
const {uploadAnimalImage} = require("./cloudinary.controller");
const {ObjectId} = require("mongodb");
const {removeImageBackground} = require("./image_processing.controller");
const mongoose_cont = require("./mongoose.controller");

const SD_PROMPT_SUFFIX = "Be creative in blending these elements into the full body of a cohesive creature."
const SD_PROMPT_SUFFIX_2 = "Behind is a empty white background. Creative, assembled, logical, clear"

const animal_data_format = (is_new, animal_data) => {return {is_new: is_new, data: animal_data}}

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
    return AnimalModel.find(query).then(res => res.map(a => [a.image, a.id, {...a.info, name:a.name}]))
}

const getLatestId = () => {
    const model = mongoose_cont.mongoose.models.Counter_id;
    return model.findOne({}).then(a=>a.seq)
}

const make_child = (id_a, id_b) => {
    return isCombinationNew(id_a, id_b).then(b=>{
        if(!b) return animal_data_format(false, getAnimalData())
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

    //query gpt for a sd prompt
    return queryChatGPT(gptPrompt2).then(sd_prompt => {
        const sd_prompt_complete = sd_prompt + SD_PROMPT_SUFFIX + SD_PROMPT_SUFFIX_2
        //get image
        return queryProteus(sd_prompt_complete, {outputs: 1}).then(image=>
            //get transparent image
            removeImageBackground(image).then(transparent_image =>
                //get latest id
                getLatestId().then(lastId => {
                    const newId = lastId+1
                    //upload image and transparent_image
                    return Promise.all([ uploadAnimalImage(image, newId), uploadAnimalImage(transparent_image, newId, true)]).then(urls =>
                        //get image description, on function result
                        askGPTDescribeImage(image).finalFunctionCallResult().then(function_result => {
                            console.log("ID: ", newId)
                            const data = JSON.parse(function_result)
                            //create database entry
                            const new_animal_data = {
                                name: data.name, sd_prompt: sd_prompt.toString(), image: urls[0],
                                parent_a: parent_a_data.id, parent_b: parent_b_data.id,
                                info:{ behaviour: data.behaviour, maxAge: data.maxAge, hunger: data.hunger}}

                            return AnimalModel.create(new_animal_data).then((_) => animal_data_format(true, new_animal_data))
                        })

                    )
                })
            )
        )
    })
}


module.exports = {
    getAnimalData,
    make_child,
    getAllAnimals,
}

