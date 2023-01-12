module.exports = {
    name: "skip",
    aliases: ["s"],
    inVoiceChannel: true,
    run: async (client, message) => {
		const queue = client.DisTube.getQueue(message)
		if (!queue) 
			return message.channel.send(`No hay nada en la lista, que skipeamos?`)
		try {
			const song = await queue.skip()
			message.channel.send(`⏭ Skipeada!`)
		} catch (e) {
			message.channel.send(`𝗛𝗮 𝘀𝘂𝗿𝗴𝗶𝗱𝗼 𝘂𝗻 𝗲𝗿𝗿𝗼𝗿 ${e}`)
		}
    }
}
