module.exports = {
    name: "play",
    aliases: ["p"],
    desc: "Oir un cumbión",
    inVoiceChannel : true,
    run: async (client, message, args) => {
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