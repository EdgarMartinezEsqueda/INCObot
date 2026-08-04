const { buscarGifAleatorio } = require("../../config/klipy.js");

module.exports = {
    name: "monaschinas",
    aliases: ["monaschinas", "monas"],
    desc: "Monitas chinas",
    run: async (client, message, args) => {
        try {
            const url = await buscarGifAleatorio("anime girls");
            if (!url)
                return message.channel.send("No encontré monitas chinas ahorita 😢");
            message.channel.send(url);
        } catch (e) {
            message.channel.send(`Error al buscar el GIF: ${e.message}`);
        }
    }
};
