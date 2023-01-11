module.exports = {
    name: "queue",
    aliases: ["q"],
    run: async (client, message) => {
		const queue = client.DisTube.getQueue(message)
		if (!queue) 
			return message.channel.send(` No hay musica reproduciendose, mamón`)
		const q = queue.songs
			.map((song, i) => `${i === 0 ? "Reproduciendo :" : `${i}.`} ${song.name} - \`${song.formattedDuration}\``)
			.join("\n")
		message.channel.send(`**Lista de canciones**\n${q}`)
    }
}
