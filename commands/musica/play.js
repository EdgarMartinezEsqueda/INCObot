require('dotenv').config();
const canalesAprobados = process.env.IDCANALES.split(','); // para aceptar mensajes de mas de un solo canal, la variable en el .env es un array "canal1,canal2"

module.exports = {
    name: "play",
    aliases: ["p"],
    desc: "Oir un cumbión",
    inVoiceChannel : true,
    run: async (client, message, args) => {
        if( !canalesAprobados.includes(message.channel.id) ){
            message.delete();
            return message.channel.send(`Ponlo en el canal correcto, no queremos spam ${message.author} pendejo `);
        }

        if( args.length === 0 )
            return message.channel.send(`Tienes que poner la canción, pendejo`);

        // DisTube v5: play() ahora LANZA (rejeta) los errores en vez de emitirlos
        // por eventos como el antiguo 'searchNoResult'. Por eso lo envolvemos aquí.
        try {
            await client.DisTube.play(message.member.voice.channel, args.join(" "), {
                member: message.member,
                textChannel: message.channel,
                message
            });
        } catch (error) {
            if( error?.errorCode === "NO_RESULT" )
                return message.channel.send(`No encontré nada para ${args.join(" ")} xd`);
            return message.channel.send(`⚠ No pude reproducir eso: ${(error?.message ?? error).toString().slice(0, 1900)}`);
        }
    }
};
