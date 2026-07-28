const { YouTubePlugin } = require("@distube/youtube");
const { json } = require("@distube/yt-dlp");
const { DisTubeError } = require("distube");
const { ensureYtDlp } = require("./ytdlp.js");

/**
 * YouTube cambió su reproductor y ytdl-core (tanto @distube/ytdl-core oficial
 * como los forks) ya no puede descifrar el parámetro `n` de las URLs:
 *   "Could not parse decipher function" / "Could not parse n transform function"
 * El resultado es que SÍ devuelve una URL de audio, pero YouTube la responde con
 * HTTP 403 y 0 bytes. Como ffmpeg sale con código 0 en ese caso, DisTube no
 * emite ningún error: la canción aparece como "Ahora escuchamos" y de inmediato
 * salta el evento 'finish' sin que suene nada.
 *
 * yt-dlp sí se mantiene al día con esos cambios, así que este plugin conserva la
 * búsqueda y los metadatos de @distube/youtube (que funcionan bien y son rápidos)
 * y únicamente delega en yt-dlp la obtención de la URL de reproducción.
 */
class YouTubeYtDlpPlugin extends YouTubePlugin {
    async getStreamURL(song) {
        if (!song.url) throw new DisTubeError("CANNOT_RESOLVE_SONG", `${song}`);
        await ensureYtDlp();

        const info = await json(song.url, {
            dumpSingleJson: true,
            noWarnings: true,
            preferFreeFormats: true,
            skipDownload: true,
            simulate: true,
            format: "ba/ba*", // mejor audio disponible
        }).catch((e) => {
            throw new DisTubeError(
                "YTDLP_STREAM_ERROR",
                `yt-dlp no pudo obtener el audio de ${song.url}: ${(e.stderr || e.message || e).toString().slice(0, 500)}`,
            );
        });

        if (!info?.url) throw new DisTubeError("CANNOT_GET_STREAM_URL", `${song}`);
        return info.url;
    }
}

module.exports = { YouTubeYtDlpPlugin };
