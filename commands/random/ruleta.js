module.exports = {
    name: "ruleta",
    desc: "¿Quieres jugarte un timeout? 👀",
    run: async (client, message, args) => {
        // Ruleta rusa xd
        // let member = await message.guild.members.fetch(message.author.id);
        message.member?.timeout(60 * 1000, `${message.author} ha sido bloqueado por 1 minuto`);
        if ( Math.floor(Math.random() * 6) + 1 === 1) 
            console.log(message.member.user)
        else
            message.channel.send(`Te salvaste ${message.author}`);
    }
};