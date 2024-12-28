const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const { EmbedBuilder } = require("discord.js");

/* Music platforms icons. */
const platforms = {
    "youtube": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/512px-YouTube_full-color_icon_%282017%29.svg.png",
    "spotify": "https://upload.wikimedia.org/wikipedia/commons/7/75/Spotify_icon.png",
    "soundcloud": "https://upload.wikimedia.org/wikipedia/de/thumb/f/f4/SoundCloud_-_Logo.svg/2560px-SoundCloud_-_Logo.svg.png"
}

const getPlatform = (url) => Object.keys(platforms)
    .find( platform => url.includes(platform) )

const formatViews = (views) => `${views}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")

const EMBED_COLOR = "#666699"

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
            const platform = getPlatform(song.url);
            const Embed = new EmbedBuilder()
                .setColor(EMBED_COLOR)
                .setTitle(song.name)
                .setURL(song.url)
                .setAuthor({ name: "🎶 Ahora escuchamos", iconURL: "https://raw.githubusercontent.com/HELLSNAKES/Music-Slash-Bot/main/assets/music.gif"} )
                .setThumbnail(platforms[platform])
                .addFields(
                    { name: "Duración:", value: `\` ${song.formattedDuration} \``, inline: true},
                    { name: "Reproducciones:", value: `\` ${formatViews(song.views)} \``, inline: true },
                )
                .setImage(song.thumbnail)
                .setFooter({ text: `Añadida por ${song.user.username}`, iconURL: song.user.avatarURL() } );
            queue.textChannel.send( {embeds: [Embed] } );
        })
        .on('addSong', (queue, song) => {
            const Embed = new EmbedBuilder()
                .setColor(EMBED_COLOR)
                .setAuthor( { name: "➕ 𝘈𝘨𝘳𝘦𝘨𝘢𝘥𝘢", iconURL:"https://raw.githubusercontent.com/HELLSNAKES/Music-Slash-Bot/main/assets/music.gif"} )
                .setThumbnail(song.thumbnail)
                .setDescription(`[${song.name}](${song.url}) - ${song.formattedDuration}`);
            queue.textChannel.send( {embeds: [Embed] } );
        })
        .on('addList', (queue, playlist) =>{
            const Embed = new EmbedBuilder()
                .setColor(EMBED_COLOR)
                .setAuthor( { name:"➕ 𝘈𝘨𝘳𝘦𝘨𝘢𝘥𝘢", iconURL:"https://raw.githubusercontent.com/HELLSNAKES/Music-Slash-Bot/main/assets/music.gif"} )
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
