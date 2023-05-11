const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config()

const configuration = new Configuration({
  apiKey: process.env.CHAT_GPT_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = {
    name: "chiste",
    desc: "Saluda a la IA",
    run: async (client, message, args) => {
        try {
            const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: "Dinos un chiste IA",
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