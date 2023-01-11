module.exports = {
    name: "pareja",
    desc: "¿Que INCOgible será tu pareja? 🔥",
    run: async (client, message, args) => {
        const n = Math.floor(( Math.random() * (100 - 0) + 0));
        if( args.length === 0 ) {
            let usuario = message.guild.members.cache.random().user;
            while(usuario.id === message.author.id)
                usuario = message.guild.members.cache.random().user;
            message.channel.send(`El ${message.author} tiene un %${n} de probabilidad de ser pareja con ${usuario} 🥵👀`);
        }
        else
            message.channel.send(`El ${message.author} tiene un %${n} de probabilidad de ser pareja con ${args.pop()} 🥵👀`);
    }
};