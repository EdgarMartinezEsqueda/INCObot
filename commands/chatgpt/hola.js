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
            const completion = await openai.chat.completions.create({
                messages: [{ role: 'user', content: "Hola IA" + args.join(" ") }],
                model: 'gpt-3.5-turbo',
            });
            console.log(completion, completion.data.choices[0]);
            message.channel.send(completion.data.choices[0].text ? completion.data.choices[0].text : 'NADA');
        }
        catch (error) {
            console.log(error);
        }
    }
};