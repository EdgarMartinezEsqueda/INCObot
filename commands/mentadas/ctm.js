module.exports = {
    name: "ctm",
    desc: "Mentale su madre a alguien",
    run: async (client, message, args) => {
        if( message.mentions.users.first() ){
            message.mentions.users.map( user => 
                message.channel.send({ 
                    content: `Chingas a tu madre <@${ user.id }>`,
                    tts: true 
                }) 
            );  
        }
        else
            return message.channel.send(`Tienes que mencionar a alguien, ${message.author} pendejo`, { tts: true });
    }
};