const OpenAI = require("openai");
const openai = new OpenAI();

const queryChatGPT = (prompt) => {
    return openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4o-mini",
    }).then(completion => completion.choices[0].message.content);
}

const description = (args) => {
    console.log("data:", JSON.stringify(args))
}

const askGPTDescribeImage = (imageURL, animalId) => {
    const detail = "low" //"low"
    const tools =  [
        {
            type: "function",
            function: {
                "function": description,
                parse: "JSON.parse",
                description: "Describe a fictional animal",
                parameters: {
                    type: "object",
                    properties: {
                        name: {
                            "type": "string",
                            "description": "A funny,quirky,childish but mysterious name for the animal"
                        },
                        behaviour: {
                            "type": "string",
                            "description": "Describe the creatures habitat, daily life and behaviour in a short paragraph"
                        },
                        maxAge: {
                            "type": "number",
                            "description": "An estimate of the life expectancy for the animal"
                        },
                        hunger: {
                            "type": "number",
                            "description": "How much food the animal needs to live",
                            "maximum": 10,
                            "minimum": 0
                        }
                    },
                    "required": [
                        "name",
                        "habitatDescription",
                        "maxAge",
                        "hunger"
                    ]
                }
            }
        }]

    return openai.beta.chat.completions.runTools(
        {
        model: "gpt-4o-mini",
        tools: tools,
        tool_choice: {"type": "function", "function": {"name": "description"}},
        messages: [{ role: "user",
            content: [
                {
                    "type": "text", "text": "Describe this fictional creature"
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": imageURL,
                        "detail": detail
                    }
                }
            ]
        }],
    })//.on('functionCall', (message) => console.log("Called description function, params: \n", message));
}


module.exports = {
    queryChatGPT,
    askGPTDescribeImage
}