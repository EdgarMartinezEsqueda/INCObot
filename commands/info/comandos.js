const { EmbedBuilder, Formatters, Embed } = require('discord.js');
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
            
            let comando = commands.filter(obj => obj.name.includes(cmd) );
            if ( !comando.length )   // command.length = 0 means NOT FOUND
                return message.channel.send( { embeds: [ new EmbedBuilder().setTitle('Comando no encontrado').setColor("6C102B") ]})

            for( const cmdFound of comando){
                const Embed = new EmbedBuilder()
                    .setTitle(`Comando ${cmdFound.name}`)
                    .setDescription( cmdFound.description )
                    .addFields( 
                        { name: 'Alias', value: cmdFound.aliases.join(' | ') || '**N/A**', inline: true },
                        { name: 'Uso', value: "*" + cmdFound.usage + "*", inline: true  },
                        { name: 'Ejemplo', value: "```" + cmdFound.example + "```" }
                    )
                    .setColor("#A5CDE8");
                message.channel.send( { embeds:   [Embed] });
            }
        })
    }
};