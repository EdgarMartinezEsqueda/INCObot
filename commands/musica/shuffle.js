module.exports = {
    name: "shuffle",
    inVoiceChannel: true,
    run: async (client, message) => {
        const queue = client.DisTube.getQueue(message);
        if (!queue)
            return message.channel.send(`No hay nada en la lista, pendejo 🗿`);
        await queue.shuffle(); // DisTube v5: shuffle() ahora es asíncrono (Promise)
        message.channel.send("Mezcladas las canciones");
    },
};
