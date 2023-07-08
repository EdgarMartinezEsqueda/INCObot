const { EmbedBuilder } = require('discord.js');
const ms = require("ms");
const remind = require("../../controllers/ctrlReminder");

module.exports = {
    name: "reminder",
    aliases: ["remind", "recuerda", "recuerdame"],
    desc: "El bot te recordará algo",
    run: async (client, message, args) => {
        // !remind <user> <time> <remind>           // args = [<user>, <time>, <remind>]
        const mentionedUser = message.mentions.users.first(); // Get the first mentioned user
        const userToRemind = mentionedUser?.id ?? message.author.id; // if there is no username, get the author
        let time = args[1];
        let reminderMessage = args.slice(2).join(' ');

        if( !mentionedUser ){   // if the user is not mentioned, so the time and reminder are one before
            time = args[0];
            reminderMessage = args.slice(1).join(' ');
        }
        
        time = Date.now() + ms(time);
        if( isNaN(time) ) return message.reply(`Ha surgido un error creando el recordatorio, usa el comando "!info" para más ayuda`);
        
        const resultado = await remind.crearRecordatorio(userToRemind, reminderMessage, time);

        if( resultado.error )
            return message.reply("Escribe bien tu chingadera");

        const Embed = new EmbedBuilder()
            .setTitle(`Se ha guardado el recordatorio`)
            .setDescription( `Lo recordaré el ${new Date(time) }` )
            .setColor('#5D6D7E');
        
        return message.channel.send( { embeds: [Embed] } );
    }
};