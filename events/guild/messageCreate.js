const tagAlBot = [
    `Este wey le escribió a un Bot <:KEKW:815733223149010964>`,
    `¿Por que le hablas a un bot? <:o_:887001307444023367> `,
    `¿Por que estas tan obsesionado conmigo? <:REEeee:901173179106623538>`,
    `¿Estás consciente que solo soy un bot, cierto? <:o_:887001307444023367>`,
    `No se que quieres pero si quieres que haga algo usa un comando 👍`,
    `Debes estar desesperado como para hablarle a un bot`,
];

module.exports = async (client, userStates, message) => {
    if (message.mentions.has(client.user)) {
        n = Math.floor(Math.random() * tagAlBot.length);
        return message.reply(tagAlBot[n]);
    }

    if (!message.author.bot && message.content.startsWith(client.prefix)) {
        const args = message.content
            .slice(client.prefix.length)
            .trim()
            .split(" ")
            .filter((arg) => arg);
        const cmd = args.shift()?.toLowerCase();
        const command =
            client.commands.get(cmd) ||
            client.commands.find((c) => c.aliases && c.aliases.includes(cmd));

        if (command && command.inVoiceChannel && !message.member.voice.channel)
            return message.channel.send(
                `Tienes que estar en un canal de voz, pendejo`,
            );

        if (command)
            try {
                await command.run(client, message, args, userStates);
            } catch (e) {
                console.log(e);
                return message.reply(
                    `Ha surgido un error con tu comando\nUsa "!info <comando>" para más información sobre ese comando o reportalo kbron`,
                );
            }
    }
};
