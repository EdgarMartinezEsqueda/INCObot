require("dotenv").config();
//require("./config/database.js");
const Discord = require("discord.js");
const noPares = require("./server.js");

const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.Guilds,
		Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildVoiceStates,
		Discord.GatewayIntentBits.GuildMembers,
		Discord.GatewayIntentBits.MessageContent
    ]
});

const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { YtDlpPlugin } = require('@distube/yt-dlp');

client.DisTube = new DisTube(client, {
    leaveOnStop: false,
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false,
    plugins: [
      new SpotifyPlugin({
        emitEventsAfterFetching: true
      }),
      new SoundCloudPlugin(),
      new YtDlpPlugin()
    ]
});

client.DisTube
    .on('playSong', (queue, song) =>
        queue.textChannel.send( `🎶 𝘈𝘩𝘰𝘳𝘢 𝘦𝘴𝘤𝘶𝘤𝘩𝘢𝘮𝘰𝘴 - ${song.name} - ${song.formattedDuration}` )
    )
    .on('addSong', (queue, song) => 
        queue.textChannel.send( `➕ 𝘈𝘨𝘳𝘦𝘨𝘢𝘥𝘢 ${song.name} - ${song.formattedDuration} a la lista` )
    )
    .on('addList', (queue, playlist) =>
        queue.textChannel.send( `➕ 𝘈𝘨𝘳𝘦𝘨𝘢𝘥𝘢 - ${playlist.name} playlist (${ playlist.songs.length } canciones) a la lista` )
    )
    .on('error', (channel, e) => {
        if (channel) 
            channel.send( `⚠ 𝗛𝗮 𝘀𝘂𝗿𝗴𝗶𝗱𝗼 𝘂𝗻 𝗲𝗿𝗿𝗼𝗿 ${e.toString().slice(0, 1974)}`);
        else 
            console.error(e);
    })
    .on('empty', channel => 
        channel.send('Ya me dejaron solo, ni pedo... 😢')
    )
    .on('searchNoResult', (message, query) =>
        message.channel.send(`No encontré nada para ${query} xd`)
    )
    .on('finish', queue => 
        queue.textChannel.send('Ya es toda we! 🗿\nPonte otra 🎶🎵')
    );

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
