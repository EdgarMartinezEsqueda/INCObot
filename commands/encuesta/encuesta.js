const { EmbedBuilder } = require('discord.js');

const emojis = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

module.exports = {
    name: "encuesta",
    aliases: ["poll"],
    desc: "Hacer encuestas",
    run: async (client, message, args) => {
        if( args.length > 1 ){  // At least one option for the poll
            const datos = args.join(" ").split(".");
            const pregunta = datos[0];
            const opciones = datos.slice(1);
            
            if (opciones.length > emojiList.length) 
                return message.channel.send('Demasiadas opciones para este pobre bot 💀');
            
            const Embed = new EmbedBuilder()
                .setTitle( `📊 Encuesta: ${pregunta}` )
                .addFields(
                    { name: "Opciones", value: opciones.join("\n") }
                )
                .setColor('#48555a');

            message.channel.send( { embeds: [Embed] } )
            .then( msg => {
                opciones.forEach( (_, i) => {
                    msg.react( String.fromCodePoint( emojis[i].codePointAt(0) - 65 + 0x1f1e6) );//All of this line is to get the unicode for that emoji
                });
            })
            .catch( console.error );
                
        }
        else
            return message.channel.send(`Esta perra tu encuesta we 🗿👍`);
    }
};