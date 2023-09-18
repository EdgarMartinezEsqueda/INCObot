const { EmbedBuilder, Formatters, Embed } = require('discord.js');

module.exports = {
    name: "equipos",
    desc: "¿Cansado de no saber como formar equipos para la escuela? ¡Este comando te ayuda en eso!",
    run: async (client, message, args) => {
        try{
            let num = args.pop(); // The last number HAS TO BE A NUMBER
            //Check if the last argument is a number
            if( isNaN(num) )   return message.reply(`Si no sabes que vrga haces para eso está '!info <comando>'`);	

            let equipos = [];
            let loop = args.length / num;

            for(let i = 0;  i < loop; i++){ // Loop for create the teams
                let aux = [];
                for(let j = 0; j < num; j++){
                    let pos = Math.floor( Math.random() * (args.length - 0) );
                    aux.push(args[pos]);
                    args.splice(pos,1);
                }
                equipos.push(aux);
            }
            // Add the teams to the embed message
            const Embed = new EmbedBuilder()
                .setTitle("Equipos Creados 👷‍♂️");
            for(let i = 0; i < equipos.length; i ++)
                Embed.addFields({ name: `**Equipo #${i+1}**`, value: equipos[i].join(", ") });
            Embed.setColor("#B7E60A");

            message.channel.send({ embeds: [Embed] });
        }
        catch (e){
            message.channel.send(`Sepa la vrga que pasó pero peto esta mmda ${e}`);
        }
    }
};