module.exports = {
    name: "ctm",
    desc: "Mentale su madre a alguien",
    run: async (client, message, args) => {
        if( message.mentions.users.first() ){
            message.channel.send({ 
                content: `Chingas a tu madre ${ message.mentions.users.first() }`,
                tts: true 
            });  
        }
        else
            return message.channel.send(`Tienes que mencionar a alguien, ${message.author} pendejo`, { tts: true });
    }
};