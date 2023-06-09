const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "nowplaying",
    aliases: ["np"],
    inVoiceChannel: true,
    run: async (client, message, args) => {
		const queue = client.DisTube.getQueue(message)
		if (!queue) return message.channel.send(` No hay musica reproduciendose, mamón`)
		const song = queue.songs[0]
		const Embed = new EmbedBuilder()
            .setTitle(`Estamos escuchando ahora:`)
            .setDescription( song.name )
            .setURL(song.url)
            .addFields(
                { name: "Duración", value: song.formattedDuration, inline: true },
            )
            .setThumbnail( song.thumbnail )
            .setColor('#B63674');
        
        message.channel.send( { embeds: [Embed] } );
    }
}