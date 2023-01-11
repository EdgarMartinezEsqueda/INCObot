module.exports = async (client, message) => {
    if ( !message.author.bot || message.author.bot && !message.content.includes("https://") ) return;
	message.channel.send(`Pa' que lo borra joto \n ${message.content.split(" ").pop()}`);
};
