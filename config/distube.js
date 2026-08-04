const { DisTube } = require("distube");
const { YouTubeYtDlpPlugin } = require("./youtubePlugin.js");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { SpotifyPlugin } = require("@distube/spotify");
const { DeezerPlugin } = require("@distube/deezer");
const { YtDlpPlugin } = require("@distube/yt-dlp");
const { EmbedBuilder } = require("discord.js");
const ffmpegStatic = require("ffmpeg-static");
const { generateDependencyReport } = require("@discordjs/voice");
const { ensureYtDlp } = require("./ytdlp.js");

/* Music platforms icons. */
const platforms = {
    youtube:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/512px-YouTube_full-color_icon_%282017%29.svg.png",
    spotify:
        "https://upload.wikimedia.org/wikipedia/commons/7/75/Spotify_icon.png",
    soundcloud:
        "https://upload.wikimedia.org/wikipedia/de/thumb/f/f4/SoundCloud_-_Logo.svg/2560px-SoundCloud_-_Logo.svg.png",
};

const getPlatform = (url = "") =>
    Object.keys(platforms).find((platform) => url.includes(platform));

const formatViews = (views) => `${views}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const EMBED_COLOR = "#666699";

/**
 * Comprueba en el arranque que la cadena de audio de SALIDA está completa:
 * ffmpeg -> codificador de opus -> cifrado -> UDP. En el VPS es fácil que
 * @discordjs/opus o la librería de cifrado no se hayan compilado (p.ej. si el
 * install corrió con los scripts bloqueados) y, cuando falta cualquiera de esas
 * piezas, la canción se anuncia ('playSong') y salta a 'finish' sin sonar y SIN
 * emitir 'error'. Este aviso lo hace visible en el log en vez de en silencio.
 */
const comprobarAudio = () => {
    let reporte;
    try {
        reporte = generateDependencyReport();
    } catch {
        return; // Nunca debe tumbar el arranque; es sólo diagnóstico.
    }
    if (process.env.DISTUBE_DEBUG === "1") console.log(reporte);

    // Extrae las líneas "- ..." que hay bajo un título de sección del reporte.
    const bloque = (titulo) => {
        const lineas = reporte.split("\n");
        const i = lineas.findIndex((l) => l.trim() === titulo);
        if (i === -1) return [];
        const out = [];
        for (let j = i + 1; j < lineas.length; j++) {
            const l = lineas[j].trim();
            if (!l.startsWith("-")) break; // la sección termina en la línea vacía
            out.push(l);
        }
        return out;
    };
    const algunaPresente = (lineas) =>
        lineas.some((l) => !/not found/i.test(l));

    const avisos = [];
    if (!algunaPresente(bloque("Opus Libraries")))
        avisos.push("no hay codificador de opus (@discordjs/opus ni opusscript)");
    if (!algunaPresente(bloque("Encryption Libraries")))
        avisos.push("no hay librería de cifrado de voz (libsodium-wrappers, etc.)");
    const ffmpeg = bloque("FFmpeg");
    if (!ffmpeg.length || /version:\s*not found/i.test(ffmpeg.join("\n")))
        avisos.push("ffmpeg no está disponible para @discordjs/voice");

    if (avisos.length) {
        console.error(
            "[audio] La cadena de reproducción está incompleta; las canciones " +
                "pueden anunciarse y saltar a 'finish' sin sonar:",
        );
        avisos.forEach((a) => console.error(`  - ${a}`));
        console.error(
            "  Reinstala en el VPS permitiendo los scripts de compilación y " +
                "ejecuta: npm run musica:diagnostico",
        );
    }
};

module.exports = (client) => {
    // Verifica opus/cifrado/ffmpeg antes de nada: si falta algo, se ve en el log.
    comprobarAudio();

    // Descarga yt-dlp al arrancar si falta, para que la primera canción no espere.
    ensureYtDlp().catch((e) =>
        console.error("[yt-dlp] no se pudo preparar el binario:", e.message),
    );

    client.DisTube = new DisTube(client, {
        emitNewSongOnly: true,
        emitAddSongWhenCreatingQueue: false,
        emitAddListWhenCreatingQueue: false,
        // DisTube v5: YouTube ya no viene integrado. Cada fuente es un plugin.
        // El orden define la prioridad al validar la URL de entrada; YtDlpPlugin
        // valida TODAS las URLs (validate() => true), por eso va al final como
        // "catch-all" para no interceptar a los plugins específicos.
        plugins: [
            new YouTubeYtDlpPlugin(), // YouTube entero vía yt-dlp (ExtractorPlugin)
            new SoundCloudPlugin(), // enlaces de SoundCloud (ExtractorPlugin)
            new SpotifyPlugin(), // resuelve enlaces de Spotify -> reproduce vía YouTube (InfoExtractorPlugin)
            new DeezerPlugin(), // resuelve enlaces de Deezer -> reproduce vía YouTube (InfoExtractorPlugin)
            // update:false -> su auto-actualización re-descarga 18 MB en cada
            // arranque y puede tumbar el proceso (ver config/ytdlp.js).
            new YtDlpPlugin({ update: false }), // catch-all para cualquier otra URL
        ],
        ffmpeg: {
            // Si ffmpeg-static no bajó su binario (p.ej. npm ci --ignore-scripts)
            // devuelve null; en ese caso usamos el ffmpeg del sistema (apt).
            path: process.env.FFMPEG_PATH || ffmpegStatic || "ffmpeg",
        },
    });

    client.DisTube.on("playSong", (queue, song) => {
        const platform = getPlatform(song.url);
        const Embed = new EmbedBuilder()
            .setColor(EMBED_COLOR)
            .setTitle(song.name)
            .setURL(song.url)
            .setAuthor({
                name: "🎶 Ahora escuchamos",
                iconURL:
                    "https://raw.githubusercontent.com/HELLSNAKES/Music-Slash-Bot/main/assets/music.gif",
            })
            .setThumbnail(platforms[platform])
            .addFields(
                {
                    name: "Duración:",
                    value: `\` ${song.formattedDuration} \``,
                    inline: true,
                },
                {
                    name: "Reproducciones:",
                    value: `\` ${formatViews(song.views ?? 0)} \``,
                    inline: true,
                },
            )
            .setImage(song.thumbnail)
            .setFooter({
                text: `Añadida por ${song.user?.username ?? "alguien"}`,
                iconURL: song.user?.avatarURL(),
            });
        queue.textChannel?.send({ embeds: [Embed] });
    })
        .on("addSong", (queue, song) => {
            const Embed = new EmbedBuilder()
                .setColor(EMBED_COLOR)
                .setAuthor({
                    name: "➕ 𝘈𝘨𝘳𝘦𝘨𝘢𝘥𝘢",
                    iconURL:
                        "https://raw.githubusercontent.com/HELLSNAKES/Music-Slash-Bot/main/assets/music.gif",
                })
                .setThumbnail(song.thumbnail)
                .setDescription(
                    `[${song.name}](${song.url}) - ${song.formattedDuration}`,
                );
            queue.textChannel?.send({ embeds: [Embed] });
        })
        .on("addList", (queue, playlist) => {
            const Embed = new EmbedBuilder()
                .setColor(EMBED_COLOR)
                .setAuthor({
                    name: "➕ 𝘈𝘨𝘳𝘦𝘨𝘢𝘥𝘢",
                    iconURL:
                        "https://raw.githubusercontent.com/HELLSNAKES/Music-Slash-Bot/main/assets/music.gif",
                })
                .setThumbnail(playlist.thumbnail)
                .setDescription(
                    `[${playlist.name}](${playlist.url}) - ${playlist.songs.length} canciones`,
                );
            queue.textChannel?.send({ embeds: [Embed] });
        })
        // DisTube v5: el evento 'error' ahora emite (error, queue, song),
        // ya NO (channel, error) como en v4.
        .on("error", (error, queue) => {
            // Siempre al log del VPS: el mensaje de Discord se recorta y se pierde.
            console.error("[DisTube error]", error);
            if (queue?.textChannel)
                queue.textChannel.send(
                    `⚠ 𝗛𝗮 𝘀𝘂𝗿𝗴𝗶𝗱𝗼 𝘂𝗻 𝗲𝗿𝗿𝗼𝗿 ${error.toString().slice(0, 1974)}`,
                );
        })
        // DisTube v5: 'empty' emite (queue), ya NO (channel).
        .on("empty", (queue) =>
            queue.textChannel?.send("Ya me dejaron solo, ni pedo... 😢"),
        )
        .on("finish", (queue) =>
            queue.textChannel?.send("Ya es toda we! 🗿\nPonte otra 🎶🎵"),
        );
    // Nota v5: el evento 'searchNoResult' fue eliminado. Cuando una búsqueda no
    // arroja resultados, DisTube#play lanza un DisTubeError (NO_RESULT); se
    // maneja con try/catch en commands/musica/play.js.

    // Diagnóstico opcional (DISTUBE_DEBUG=1 en el .env).
    // Importante: DisTube ignora los códigos de salida 0 y 255 de ffmpeg, así que
    // un stream que muere al instante NO emite el evento 'error' y la canción
    // "termina" en silencio. Estos logs son la única forma de verlo; muestran la
    // línea real de ffmpeg y su código de salida.
    if (process.env.DISTUBE_DEBUG === "1") {
        client.DisTube.on("ffmpegDebug", (info) =>
            console.log("[ffmpeg]", info),
        ).on("debug", (info) => console.log("[distube]", info));
    }
};
