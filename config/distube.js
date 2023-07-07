
const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const { EmbedBuilder } = require("discord.js");

module.exports = ( client ) => {
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
        .on('playSong', (queue, song) =>{
            const Embed = new EmbedBuilder()
                .setColor("#666699")
                .setAuthor({ name: "🎶 Ahora escuchamos", icon: "https://raw.githubusercontent.com/HELLSNAKES/Music-Slash-Bot/main/assets/music.gif"} )
                .setThumbnail(song.thumbnail)
                .setDescription(`[${song.name}](${song.url}) - ${song.formattedDuration}`)
                .setFooter({ text: `Añadida por ${song.user.username}`, iconURL: song.user.avatarURL() } );
            queue.textChannel.send( {embeds: [Embed] } );
        })
        .on('addSong', (queue, song) => {
            const Embed = new EmbedBuilder()
                .setColor("#6419BD")
                .setAuthor( { name: "➕ 𝘈𝘨𝘳𝘦𝘨𝘢𝘥𝘢", icon:"https://raw.githubusercontent.com/HELLSNAKES/Music-Slash-Bot/main/assets/music.gif"} )
                .setThumbnail(song.thumbnail)
                .setDescription(`[${song.name}](${song.url}) - ${song.formattedDuration}`);
            queue.textChannel.send( {embeds: [Embed] } );
        })
        .on('addList', (queue, playlist) =>{
            const Embed = new EmbedBuilder()
                .setColor("#6419BD")
                .setAuthor( { name:"➕ 𝘈𝘨𝘳𝘦𝘨𝘢𝘥𝘢", icon:"https://raw.githubusercontent.com/HELLSNAKES/Music-Slash-Bot/main/assets/music.gif"} )
                .setThumbnail(song.thumbnail)
                .setDescription(`[${song.name}](${song.url}) - ${ playlist.songs.length } canciones`);
            queue.textChannel.send( {embeds: [Embed] } );
        })
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
}