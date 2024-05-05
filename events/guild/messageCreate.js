module.exports = async (client, userStates, message) => {
	if (message.author.bot || !message.content.startsWith("!")) return;
	const args = message.content.slice(1).trim().split(" ").filter( arg => arg );
	const cmd = args.shift()?.toLowerCase();
	const command =
		client.commands.get(cmd) ||
		client.commands.find( c => c.aliases && c.aliases.includes(cmd));

	if (command && command.inVoiceChannel && !message.member.voice.channel) 
		return message.channel.send(`Tienes que estar en un canal de voz, pendejo`);
	
	if (command) 
		try{
			await command.run(client, message, args, userStates);
		}
		catch(e){
			console.log(e);
			return message.reply(`Ha surgido un error con tu comando\nUsa "!info <comando>" para más información sobre ese comando o reportalo kbron`);
		}
};
