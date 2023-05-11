module.exports = {
    name: "clear",
	inVoiceChannel: true,
    run: async (client, message) => {
		const queue = client.DisTube.getQueue(message);
		if (!queue) 
			return message.channel.send(`No hay nada wey, que quitamos?`)
		try {
			message.channel.send(`Se han borrado ${queue.songs.length} canciones`)
            await queue.songs.splice(1);
		}
		 catch (e) {
			message.channel.send(`𝗛𝗮 𝘀𝘂𝗿𝗴𝗶𝗱𝗼 𝘂𝗻 𝗲𝗿𝗿𝗼𝗿 ${e}`)
		}
    }
}
