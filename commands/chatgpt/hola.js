const OpenAI = require("openai");
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.CHAT_GPT_KEY,
});

module.exports = {
    name: "hola",
    desc: "Saluda a la IA",
    run: async (client, message, args) => {
        try {
            const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: "Hola IA",
            max_tokens: 100,
            });
            console.log(completion.data.choices[0]);
            message.channel.send(completion.data.choices[0].text ? completion.data.choices[0].text : 'NADA');
        }
        catch (error) {
            console.log(error);
        }
    }
};