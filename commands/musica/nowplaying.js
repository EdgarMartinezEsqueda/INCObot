module.exports = {
    name: "nowplaying",
    aliases: ["np"],
    inVoiceChannel: true,
    run: async (client, message, args) => {
		const queue = client.DisTube.getQueue(message)
		if (!queue) return message.channel.send(` No hay musica reproduciendose, mamón`)
		const song = queue.songs[0]
		message.channel.send(`𝘌𝘴𝘵𝘢𝘮𝘰𝘴 𝘦𝘴𝘤𝘶𝘤𝘩𝘢𝘯𝘥𝘰 **\`${song.name}\`**, por ${song.user}`)
    }
}
