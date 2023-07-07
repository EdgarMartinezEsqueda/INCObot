require("dotenv").config();
require("./database/database.js");
const Discord = require("discord.js");
const noPares = require("./server.js");

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
