module.exports = {
    name: "play",
    aliases: ["p"],
    desc: "Oir un cumbión",
    inVoiceChannel : true,
    run: async (client, message, args) => {
        if(message.channel.id != 885939057144758327 && message.channel.id != 784173263227322389){
            message.delete(); 
            return message.channel.send(`Ponlo en el canal correcto, no queremos spam ${message.author} pendejo `);
        }
 
        if( args.length > 0 ){
            client.DisTube.play(message.member.voice.channel, args.join(" "), {
                member: message.member,
                textChannel: message.channel,
                message
            });
        }
        else
            return message.channel.send(`Tienes que poner la canción, pendejo`);
    }
};

// 885939057144758327
// 784173263227322389