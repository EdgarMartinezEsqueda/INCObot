module.exports = {
    name: "volume",
    aliases: ["v", "set", "set-volume"],
    inVoiceChannel: true,
    run: async (client, message, args) => {
		const queue = client.DisTube.getQueue(message)
		if (!queue) 
			return message.channel.send(` No hay musica reproduciendose, mamón`)
		const volume = parseInt(args[0]);
		if (isNaN(volume)) 
			return message.channel.send(`No te quieras pasar de listo jovencito`)
		queue.setVolume(volume)
		message.channel.send(`Volumen puesto en \`${volume}\``)
    }
}
