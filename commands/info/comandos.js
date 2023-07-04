const { EmbedBuilder } = require('discord.js');
const commands = require('./commands.json');    // get all commands

const categories = {};

for (const command of commands) {   // get all commands divided by categories
    const category = command.category;
    if (!categories.hasOwnProperty(category)) // if it doesn't exist create it
        categories[category] = [];
    categories[category].push(command.name);    // add command to category
}

module.exports = {
    name:   "comandos",
    aliases:    ["info", "información", "información", "help", "ayuda", "commands"],
    desc:   "¿Quieres conocer los comandos del bot para los INCOgibles?",
    run:    async (client, message, args) => {
        if(args.length === 0){
            const Embed = new EmbedBuilder()
                .setTitle(`Comandos del INCO-bot 🤑`)
                .setDescription('INCO-bot mamalon');
                
            for( const category in categories)  // Add all commands divided by categories
                Embed.addFields( { name: `Comandos ${category}`, value: categories[category].join(' ▪ ')} );
                
            Embed.setThumbnail('https://i.imgur.com/E4w0mce.jpg')
                .setFooter( { text: "Usa '!info <comando>' para más información del comando"} )
                .setColor('#0099ff');

            return message.channel.send( { embeds:   [Embed] });
        }
        args.forEach( cmd => {
            cmd = cmd.toLowerCase();
            
            let comando = Object.entries(commandsGeneral).concat(Object.entries(commandsMusic)).filter(([k]) => k.includes(cmd) );
            comando = comando.length ? comando.flat() : ['✖','Comando no encontrado'];   // command.length = 0 means NOT FOUND
            
            const Embed = new EmbedBuilder()
                .setTitle(`Comando ${comando[0]}`)
                .setDescription( comando[1] )
                .setColor("#A5CDE8");
            message.channel.send( { embeds:   [Embed] });
        })
    }
};