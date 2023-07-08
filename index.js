require("dotenv").config();
require("./database/database.js");
const Discord = require("discord.js");
const noPares = require("./server.js");
const Recordatorio = require("./models/recordatorio");
const { EmbedBuilder } = require("discord.js");

const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
		Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildVoiceStates,
		Discord.GatewayIntentBits.GuildMembers,
		Discord.GatewayIntentBits.MessageContent,
    ]
});

require("./config/distube.js")( client );   // Add music commnds
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

const requireHandlers = () => {
    ["commands", "events"].forEach( handler => {
        try{
            require(`./handlers/${handler}`)(client, Discord);
        }
        catch(err){
            console.log(err);
        }
    });
};

requireHandlers();

client.login(process.env.TOKEN).then(() => {
    console.log(`Conectado como ${client.user.tag}`);
    noPares();
});

setInterval( async () => {  // get all reminders from database and send them
    const recordatorios = await Recordatorio.findAll();
    if( !recordatorios ) return;
    recordatorios.forEach( recordatorio => {
        if( recordatorio.tiempo > Date.now() ) return;
        const user = client.users.cache.get( recordatorio.usuario );
        
        const Embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle('Recordatorio para ti')
        .setDescription(recordatorio.recordatorio);

        user?.send( { embeds:   [Embed] } );

        Recordatorio.destroy( { where: { id: recordatorio.id } } );
    });
}, 5000);