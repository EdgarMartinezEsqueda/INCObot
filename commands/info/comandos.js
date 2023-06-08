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
                // { name: "!cornejo", value: "Una dedicatoria cuando lo recuerdes <:REEeee:901173179106623538>"}, 
                // { name: "!horacio", value: "<:linux:821495324149415946> "},
                // { name: "!ctmpro", value: "Cuando no sea PRO <:pront:888504671470252083> "},
                // { name: "!pro", value: "¿Cansado de contar por ti mismo las PRO menciones del PRO? Deja que el bot lo haga por tí ✔"},
                { name: "!pito", value: "Deja que el bot adivine cuanto te mide el pito 🥵"},
                { name: "!pareja", value: "Descubre cuanta probabilidad tienes de ser pareja con un usuario al azar del servidor 👀"},
                { name: "!pareja <usuario>", value: "Descubre cuanta probabilidad tienes de ser pareja con el usuario ingresado 😈"},
                { name: "!volado", value: "Aguila o Sello, no hay más que agregar"},
                { name: "!equipos <participantes separados por espacio> <Cantidad de integrantes>", value: "¿Cansado de no saber como formar equipos para la escuela? ¡Este comando te ayuda en eso!"},
                { name: "!ctm <usuario>", value: "Recuerdale al usuario su madresita"},
                { name: "!morraschidas", value: "( ͡° ͜ʖ ͡°)"},
                { name: "!monaschinas", value: "By: Alex"},
                { name: "!server", value: "Wacha la información de los servers actuales"},
                { name: "!clima <lugar>", value: "Obten el clima del lugar que quieras"},
                { name: "**Sección de Música**", value: '*Necesitas estar en un canal de voz*' },
                { name: "!play <canción>", value: "Reproducir una canción 🎵" },
                { name: "!queue", value: "Ve la cola de reproducción (no lo uses si hay demasiadas canciones, morirá el bot)" },
                { name: "!shuffle", value: "Mezcla la cola de reproducción si no estas conforme con el orden" },
                { name: "!nowplaying", value: "Obtén el nombre de la canción que se este escuchando" },
                { name: "!skip", value: "Quita alv la canción" },
                { name: "!volume <numero>", value: "Súbele o bájale, tu decides" },
                { name: "!repeat <no | song | queue>", value: "Modo de repetir, por default es NO" },
                { name: "!clear", value: "Limpia la cola de reproducción (unicamente se quedará la que esté sonando en el momento)" },
                { name: "!leave", value: "No dejes al bot solo, sacalo del canal de voz" }
            )
            .setThumbnail('https://i.imgur.com/E4w0mce.jpg')
            .setColor('#0099ff');
        client.users.cache.get(message.author.id).send( { embeds: [Embed] } );
        message.channel.send(`${message.author} checa tus mensajes 👀`);
    }
};