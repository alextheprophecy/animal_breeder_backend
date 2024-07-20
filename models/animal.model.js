const {mongoose} = require("../controllers/mongoose.controller")
const AutoIncrement = require('mongoose-sequence')(mongoose);

let AnimalSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    sd_prompt: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ""
    },
    parent_a : {
        type: Number,
        required: true
    },
    parent_b : {
        type: Number,
        required: true
    },
    info : {
        behaviour: {
            type: String
        },
        maxAge: {
            type: Number
        },
        hunger: {
            type: Number
        }
    }
}, {
    collection: 'animals'
})

//adds an "id" field (dont confuse with _id)
AnimalSchema.plugin(AutoIncrement, { inc_field: 'id' });

const AnimalModel = mongoose.model('Animal', AnimalSchema)

module.exports={
    AnimalModel
}

//AnimalModel.create({name: "hi", description: "hello", parent1: 1, parent2: 3})