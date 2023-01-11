const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "comandos",
    aliases: ["info", "información", "información", "help", "ayuda", "commands"],
    desc: "¿Quieres conocer los comandos del bot para los INCOgibles?",
    run: async (client, message, args) => {
        const Embed = new EmbedBuilder()
            .setTitle(`Comandos del INCO-bot 🤑`)
            .setDescription('INCO-bot mamalon')
            .addFields(
                { name: "!cornejo", value: "Una dedicatoria cuando lo recuerdes <:REEeee:901173179106623538>"}, 
                { name: "!horacio", value: "<:linux:821495324149415946> "},
                { name: "!ctmpro", value: "Cuando no sea PRO <:pront:888504671470252083> "},
                { name: "!pro", value: "¿Cansado de contar por ti mismo las PRO menciones del PRO? Deja que el bot lo haga por tí ✔"},
                { name: "!pito", value: "Deja que el bot adivine cuanto te mide el pito 🥵"},
                { name: "!pareja", value: "Descubre cuanta probabilidad tienes de ser pareja con un usuario al azar del servidor 👀"},
                { name: "!pareja <usuario>", value: "Descubre cuanta probabilidad tienes de ser pareja con el usuario ingresado 😈"},
                { name: "!volado", value: "Aguila o Sello, no hay más que agregar"},
                { name: "!equipos <participantes separados por espacio> <Cantidad de integrantes>", value: "¿Cansado de no saber como formar equipos para la escuela? ¡Este comando te ayuda en eso!"},
                { name: "!morraschidas", value: "( ͡° ͜ʖ ͡°)"},
                { name: "!monaschinas", value: "By: Alex"}
            )
            .setColor('#0099ff')
            .setImage('https://i.imgur.com/E4w0mce.jpg');
        client.users.cache.get(message.author.id).send( { embeds: [Embed] } );
        message.channel.send(`${message.author} checa tus mensajes 👀`);
    }
};