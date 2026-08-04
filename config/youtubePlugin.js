const { YouTubePlugin } = require("@distube/youtube");
const { json } = require("@distube/yt-dlp");
const { DisTubeError, Song, Playlist } = require("distube");
const { ensureYtDlp } = require("./ytdlp.js");

/**
 * Plugin de YouTube que hace TODO con yt-dlp.
 *
 * @distube/youtube v1.0.4 se apoya en dos scrapers del HTML de youtube.com:
 *
 *  - @distube/ytsr (búsqueda). YouTube empezó a marcar los videos con varios
 *    artistas usando un `showDialogCommand` ("Collaborators") en lugar del
 *    `browseEndpoint` del canal. ytsr lee `navigationEndpoint.browseEndpoint
 *    .canonicalBaseUrl` sin comprobar y revienta con
 *      TypeError: Cannot read properties of undefined (reading 'canonicalBaseUrl')
 *    Basta con que UN resultado de la página tenga colaboradores para tumbar la
 *    búsqueda entera, por eso falla de forma intermitente y pega sobre todo en
 *    música latina, donde los "feat." son la norma.
 *
 *  - @distube/ytdl-core (metadatos y URL de reproducción). Ya no puede descifrar
 *    el parámetro `n` de las URLs ("Could not parse n transform function"), así
 *    que devuelve una URL que YouTube responde con 403 y 0 bytes. Como ffmpeg
 *    sale con código 0 en ese caso y DisTube ignora los códigos 0 y 255, no se
 *    emite ningún error: la canción aparece como "Ahora escuchamos" y salta el
 *    evento 'finish' sin que suene nada.
 *
 * yt-dlp sí se mantiene al día, así que aquí se sustituyen todos los métodos que
 * tocan la red. Sólo se hereda validate(), que es una regex sobre la URL y no
 * depende del HTML de YouTube.
 */

// Cada llamada a yt-dlp arranca un proceso; estas opciones aplican a todas.
const opcionesBase = () => {
    // Ojo: las opciones se traducen con dargs, y `false` genera `--no-<flag>`
    // (p.ej. { noPlaylist: false } -> "--no-no-playlist", que yt-dlp rechaza).
    // Por eso los flags se omiten en vez de ponerse en false.
    const o = {
        noWarnings: true,
        skipDownload: true,
        retries: 3,
        socketTimeout: 15,
    };
    // Escapes para VPS bloqueados por YouTube (ver README / .env.example).
    if (process.env.YTDLP_COOKIES) o.cookies = process.env.YTDLP_COOKIES;
    if (process.env.YTDLP_PROXY) o.proxy = process.env.YTDLP_PROXY;
    if (process.env.YTDLP_PLAYER_CLIENT)
        o.extractorArgs = `youtube:player_client=${process.env.YTDLP_PLAYER_CLIENT}`;
    return o;
};

const ejecutar = async (objetivo, opciones) => {
    await ensureYtDlp();
    return json(objetivo, { ...opcionesBase(), ...opciones });
};

const mejorThumbnail = (e) =>
    e.thumbnail ||
    [...(e.thumbnails ?? [])].sort(
        (a, b) => (b.width ?? b.preference ?? 0) - (a.width ?? a.preference ?? 0),
    )[0]?.url;

/** Convierte una entrada del JSON de yt-dlp en un Song de DisTube. */
const aSong = (plugin, e, options) =>
    new Song(
        {
            plugin,
            source: "youtube",
            playFromSource: true,
            id: e.id,
            name: e.title,
            isLive: Boolean(e.is_live),
            // En directos la duración es null; DisTube espera 0.
            duration: e.is_live ? 0 : (e.duration ?? 0),
            url: e.webpage_url || e.url || `https://youtu.be/${e.id}`,
            thumbnail: mejorThumbnail(e),
            views: e.view_count ?? 0,
            likes: e.like_count ?? 0,
            uploader: {
                name: e.channel || e.uploader,
                url: e.channel_url || e.uploader_url,
            },
        },
        options,
    );

const esPlaylist = (url) => /[?&]list=([a-zA-Z0-9_-]+)/.test(url);

class YouTubeYtDlpPlugin extends YouTubePlugin {
    /** Enlaces de video y de playlist. Sustituye a ytdl-core/ytpl. */
    async resolve(url, options) {
        if (esPlaylist(url)) {
            const info = await ejecutar(url, {
                dumpSingleJson: true,
                flatPlaylist: true,
                yesPlaylist: true,
            }).catch(errorDe(url));
            const entradas = (info.entries ?? []).filter((e) => e?.id);
            if (!entradas.length)
                throw new DisTubeError("CANNOT_RESOLVE_SONG", url);
            return new Playlist(
                {
                    source: "youtube",
                    id: info.id,
                    name: info.title,
                    url: info.webpage_url || url,
                    thumbnail: mejorThumbnail(entradas[0]),
                    songs: entradas.map((e) => aSong(this, e, options)),
                },
                options,
            );
        }

        const info = await ejecutar(url, {
            dumpSingleJson: true,
            noPlaylist: true, // por si acaso: aquí sólo interesa el video
        }).catch(errorDe(url));
        if (!info?.id) throw new DisTubeError("CANNOT_RESOLVE_SONG", url);
        return aSong(this, info, options);
    }

    /** Búsqueda. Sustituye a ytsr, que es lo que estaba roto. */
    async search(query, options = {}) {
        const limit = options.limit ?? 10;
        const info = await ejecutar(`ytsearch${limit}:${query}`, {
            dumpSingleJson: true,
            flatPlaylist: true,
        }).catch(() => null);
        return (info?.entries ?? [])
            .filter((e) => e?.id)
            .map((e) => aSong(this, e, {}));
    }

    async searchSong(query, options) {
        const info = await ejecutar(`ytsearch1:${query}`, {
            dumpSingleJson: true,
            flatPlaylist: true,
        }).catch(() => null);
        const e = info?.entries?.[0];
        return e?.id ? aSong(this, e, options) : null;
    }

    /** URL de audio directa que se le pasa a ffmpeg. */
    async getStreamURL(song) {
        if (!song.url) throw new DisTubeError("CANNOT_RESOLVE_SONG", `${song}`);

        // YouTube no trata igual a todos los clientes del reproductor: desde una
        // IP de centro de datos, el que yt-dlp elige por su cuenta suele acabar
        // en 403, mientras que otros siguen sirviendo el audio. Se prueban en
        // orden y nos quedamos con el primero que YouTube acepte de verdad.
        let ultimoError;
        for (const cliente of clientesAProbar()) {
            let info;
            try {
                info = await ejecutar(song.url, {
                    dumpSingleJson: true,
                    noPlaylist: true,
                    preferFreeFormats: true,
                    simulate: true,
                    format: "ba/ba*", // mejor audio disponible
                    ...(cliente
                        ? { extractorArgs: `youtube:player_client=${cliente}` }
                        : {}),
                });
            } catch (e) {
                ultimoError = errorYtDlp(song.url, e);
                // Si el video no existe o es privado, cambiar de cliente no ayuda.
                if (esDefinitivo(ultimoError.message)) throw ultimoError;
                continue;
            }

            const url = info?.url ?? info?.requested_downloads?.[0]?.url;
            if (!url) {
                ultimoError = new DisTubeError("CANNOT_GET_STREAM_URL", `${song}`);
                continue;
            }

            // YouTube puede devolver una URL válida pero contestarla con 403.
            // ffmpeg saldría con código 0 y 0 bytes, y DisTube ignora ese código:
            // la canción "termina" en silencio y sin error. Comprobarlo aquí
            // convierte ese silencio en algo que sí se puede ver y arreglar.
            const fallo = await comprobarURL(url, info.http_headers, song);
            if (!fallo) {
                if (cliente) console.log(`[yt-dlp] usando player_client=${cliente}`);
                // La URL de googlevideo está firmada para el User-Agent que la
                // generó; hay que reenviárselo a ffmpeg o YouTube da 403 desde IPs
                // de datacenter (el VPS). Ver aplicarCabeceras().
                aplicarCabeceras(this, song, info.http_headers);
                return url;
            }
            ultimoError = fallo;
        }
        throw ultimoError ?? new DisTubeError("CANNOT_GET_STREAM_URL", `${song}`);
    }

    /** yt-dlp no expone los relacionados; sin ellos el autoplay queda inactivo. */
    async getRelatedSongs() {
        return [];
    }
}

// null = el cliente que yt-dlp elija por su cuenta (hoy android_vr).
//
// La lista es corta a propósito: a día de hoy el resto de clientes (tv, ios,
// web_safari, mweb, web_embedded...) no devuelve ningún formato sin un PO token,
// así que reintentar con ellos sólo añadiría segundos de espera para acabar en
// "Requested format is not available". `android` sí responde, aunque únicamente
// con el formato 18 (360p con audio dentro), de ahí que vaya como último recurso.
//
// Esto cambia cada pocos meses; si algún día hacen falta otros, se ponen aquí o
// se fija uno a mano con YTDLP_PLAYER_CLIENT en el .env.
const CLIENTES = [null, "android"];

const clientesAProbar = () =>
    // Si en el .env se fijó uno a mano, se respeta y no se prueba nada más.
    process.env.YTDLP_PLAYER_CLIENT ? [null] : CLIENTES;

/** Traduce el stderr de yt-dlp a un DisTubeError legible. */
const errorYtDlp = (url, e) => {
    const detalle = (e.stderr || e.message || e).toString();
    // Lo más útil de yt-dlp está en la última línea "ERROR:".
    const linea =
        detalle
            .split("\n")
            .reverse()
            .find((l) => l.includes("ERROR:")) || detalle;
    return new DisTubeError(
        "YTDLP_ERROR",
        `yt-dlp no pudo con ${url}: ${linea.trim().slice(0, 500)}`,
    );
};

/** Para los métodos que no reintentan: lanza en lugar de devolver. */
const errorDe = (url) => (e) => {
    throw errorYtDlp(url, e);
};

/** Errores en los que cambiar de cliente del reproductor no sirve de nada. */
const esDefinitivo = (mensaje) =>
    /Video unavailable|Private video|has been removed|does not exist|members-only/i.test(
        mensaje,
    );

// 16 KB de audio real bastan para distinguir "YouTube sirve el stream" de
// "YouTube acepta la conexión y la corta enseguida". Pedir sólo 1-2 bytes NO
// distingue esos dos casos: desde una IP de datacenter, YouTube suele contestar
// 206 a un rango mínimo y luego dar 403 o cortar el cuerpo en la descarga de
// verdad, que es justo lo que hace ffmpeg. Ese hueco es el que dejaba pasar una
// URL muerta y hacía que la canción "terminara" sin sonar y sin error.
const BYTES_PRUEBA = 16 * 1024;

const bloqueoURL = (detalle, song) =>
    new DisTubeError(
        "YTDLP_STREAM_BLOCKED",
        `YouTube rechazó el audio de "${song.name}" (${detalle}). ` +
            `Suele ser un bloqueo por la IP del servidor: prueba con cookies ` +
            `(YTDLP_COOKIES) o un proxy (YTDLP_PROXY), y actualiza yt-dlp con ` +
            `npm run ytdlp:update.`,
    );

/** Devuelve un error si YouTube rechaza la URL, o null si la sirve bien. */
const comprobarURL = async (url, headers, song) => {
    let res;
    try {
        res = await fetch(url, {
            method: "GET",
            headers: { ...headers, Range: `bytes=0-${BYTES_PRUEBA - 1}` },
            signal: AbortSignal.timeout(10000),
        });
    } catch {
        return null; // Si la comprobación no se puede hacer, que lo intente ffmpeg.
    }

    if (!res.ok && res.status !== 206) {
        res.body?.cancel().catch(() => {});
        return bloqueoURL(`HTTP ${res.status}`, song);
    }

    // El estado es bueno; ahora confirmamos que el cuerpo fluye de verdad. Si se
    // corta antes de los 16 KB es el mismo bloqueo por IP, sólo que silencioso.
    let recibidos = 0;
    try {
        const reader = res.body.getReader();
        while (recibidos < BYTES_PRUEBA) {
            const { done, value } = await reader.read();
            if (done) break;
            recibidos += value.length;
        }
        reader.cancel().catch(() => {});
    } catch {
        // El cuerpo murió a mitad: se trata igual que un rechazo.
    }

    if (recibidos >= BYTES_PRUEBA) return null;
    return bloqueoURL(`sólo entregó ${recibidos} bytes antes de cortar`, song);
};

/**
 * Traduce las cabeceras HTTP que yt-dlp asocia a la URL de audio al formato que
 * espera ffmpeg (-user_agent y -headers).
 *
 * Es la pieza que faltaba y la causa de que suene en Windows pero no en el VPS:
 * yt-dlp firma la URL de googlevideo para un User-Agent concreto (el del
 * player_client que la generó). comprobarURL() la valida ENVIANDO esas cabeceras,
 * así que pasa; pero DisTube lanza ffmpeg sólo con "-i url", SIN cabeceras. Desde
 * una IP residencial YouTube lo tolera; desde la IP de un centro de datos (el VPS)
 * responde 403, ffmpeg recibe 0 bytes y sale con código 0, y como DisTube ignora
 * los códigos 0 y 255 la canción se anuncia ('playSong') y salta a 'finish' sin
 * sonar y SIN error. Reenviar estas cabeceras hace que la petición de ffmpeg sea
 * idéntica a la que ya validó comprobarURL.
 */
const cabecerasFfmpeg = (headers = {}) => {
    const entradas = Object.entries(headers).filter(([, v]) => v != null);
    const ua = entradas.find(([k]) => k.toLowerCase() === "user-agent")?.[1];
    // El User-Agent va aparte (-user_agent) para no duplicarlo dentro de -headers.
    const resto = entradas.filter(([k]) => k.toLowerCase() !== "user-agent");
    const args = {};
    if (ua) args.user_agent = String(ua);
    // ffmpeg exige que la cadena de -headers termine en CRLF.
    if (resto.length)
        args.headers = resto.map(([k, v]) => `${k}: ${v}`).join("\r\n") + "\r\n";
    return args;
};

/**
 * Inyecta las cabeceras en el ffmpeg de la cola de ESTE servidor para la canción
 * que está a punto de reproducirse. DisTube crea el DisTubeStream justo después de
 * llamar a getStreamURL() y vuelca queue.ffmpegArgs.input ANTES de "-i url", que
 * es donde el protocolo http de ffmpeg lee -user_agent y -headers.
 */
const aplicarCabeceras = (plugin, song, headers) => {
    song.httpHeaders = headers; // lo reutiliza config/diagnostico.js
    // song.member -> guild -> cola. Sin cola (p.ej. en el diagnóstico) no hay nada
    // que inyectar: basta con haber dejado song.httpHeaders arriba.
    let queue;
    try {
        queue = song.member && plugin.distube?.getQueue(song.member);
    } catch {
        return;
    }
    if (!queue) return;
    queue.ffmpegArgs.input = {
        ...queue.ffmpegArgs.input,
        ...cabecerasFfmpeg(headers),
    };
};

module.exports = { YouTubeYtDlpPlugin, cabecerasFfmpeg };
