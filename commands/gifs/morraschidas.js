const { buscarGifAleatorio } = require("../../config/klipy.js");

module.exports = {
    name: "morraschidas",
    aliases: ["morraschidas", "morras"],
    desc: "Monitas chinas",
    run: async (client, message, args) => {
        const busqueda = ["morras bikini", "bikini woman", "hot bikini woman", "model woman"];
        const query = busqueda[Math.floor(Math.random() * busqueda.length)];
        try {
            const url = await buscarGifAleatorio(query);
            if (!url)
                return message.channel.send("No encontré nada ahorita 😢");
            message.channel.send(url);
        } catch (e) {
            message.channel.send(`Error al buscar el GIF: ${e.message}`);
        }
    }
};
