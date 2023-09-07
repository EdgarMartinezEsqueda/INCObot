const OpenAI = require("openai");
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.CHAT_GPT_KEY,
});

module.exports = {
    name: "chiste",
    desc: "Saluda a la IA",
    run: async (client, message, args) => {
        try {
            const completion = await openai.chat.completions.create({
                messages: [{ role: 'user', content: args.join(" ") }],
                model: 'gpt-3.5-turbo',
            });
            console.log(completion.choices, completion);
            message.channel.send(completion.choices[0].text ? completion.choices[0].text : 'NADA');
        }
        catch (error) {
            console.log(error);
        }
    }
};