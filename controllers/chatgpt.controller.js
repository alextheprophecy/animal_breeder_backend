const OpenAI = require("openai");
const openai = new OpenAI();

const queryChatGPT = (prompt) => {
    return openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
    }).then(completion => completion.choices[0].message.content);
}

module.exports = {
    queryChatGPT
}