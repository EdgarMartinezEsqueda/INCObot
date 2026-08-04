require("dotenv").config();

/**
 * Diagnóstico de la reproducción de música: `node config/diagnostico.js [búsqueda]`
 *
 * Recorre la misma cadena que sigue el comando !play (yt-dlp busca -> yt-dlp da
 * la URL de audio -> ffmpeg la lee) e informa en qué paso se rompe. Sirve sobre
 * todo en el VPS, donde YouTube bloquea las IPs de centros de datos y el fallo
 * se manifiesta como una canción que "empieza y termina" sin ningún error.
 */

const { spawn } = require("child_process");
const { generateDependencyReport } = require("@discordjs/voice");
const ffmpegStatic = require("ffmpeg-static");
const { YouTubeYtDlpPlugin } = require("./youtubePlugin.js");
const { YTDLP_BIN } = require("./ytdlp.js");

const BUSQUEDA = process.argv.slice(2).join(" ") || "bad bunny titi me pregunto";
const ffmpegPath = process.env.FFMPEG_PATH || ffmpegStatic || "ffmpeg";

const paso = (n, texto) => console.log(`\n[${n}] ${texto}`);
const ok = (texto) => console.log(`  OK    ${texto}`);
const mal = (texto) => console.log(`  FALLO ${texto}`);

const ejecutar = (cmd, args) =>
    new Promise((resolve) => {
        const p = spawn(cmd, args, { windowsHide: true });
        let out = "";
        let err = "";
        p.stdout.on("data", (d) => (out += d));
        p.stderr.on("data", (d) => (err += d));
        p.on("close", (code) => resolve({ code, out, err }));
        p.on("error", (e) => resolve({ code: null, out, err: e.message }));
    });

(async () => {
    console.log("=== Diagnóstico de música de INCObot ===");
    console.log(`plataforma: ${process.platform} | node: ${process.version}`);
    console.log(generateDependencyReport());

    paso(1, "binarios");
    const ytdlp = await ejecutar(YTDLP_BIN, ["--version"]);
    ytdlp.code === 0
        ? ok(`yt-dlp ${ytdlp.out.trim()} (${YTDLP_BIN})`)
        : mal(`yt-dlp no ejecuta: ${(ytdlp.err || ytdlp.out).trim().slice(0, 300)}`);

    const ff = await ejecutar(ffmpegPath, ["-version"]);
    ff.code === 0
        ? ok(`${ff.out.split("\n")[0]} (${ffmpegPath})`)
        : mal(`ffmpeg no ejecuta: ${(ff.err || ff.out).trim().slice(0, 300)}`);

    const plugin = new YouTubeYtDlpPlugin();

    paso(2, `búsqueda en YouTube: "${BUSQUEDA}"`);
    let song;
    try {
        song = await plugin.searchSong(BUSQUEDA, {});
        if (!song) return mal("sin resultados (¿YouTube pidiendo verificación?)");
        ok(`${song.name} — ${song.formattedDuration} — ${song.url}`);
    } catch (e) {
        return mal(e.message);
    }

    paso(3, "URL de audio (yt-dlp) y comprobación HTTP");
    let url;
    try {
        url = await plugin.getStreamURL(song);
        ok(`URL obtenida y aceptada por YouTube`);
    } catch (e) {
        mal(e.message);
        console.log(
            "\n  => Aquí es donde falla el VPS cuando YouTube bloquea su IP.\n" +
                "     Prueba: npm run ytdlp:update, y si sigue, define YTDLP_COOKIES\n" +
                "     o YTDLP_PROXY en el .env (ver .env.example).",
        );
        return;
    }

    paso(4, "ffmpeg leyendo 5 s de audio (como hace DisTube)");
    const args = [
        "-reconnect", "1",
        "-reconnect_streamed", "1",
        "-reconnect_delay_max", "5",
        "-analyzeduration", "0",
        "-hide_banner",
        "-i", url,
        "-ar", "48000",
        "-ac", "2",
        "-t", "5",
        "-f", "s16le",
        "pipe:1",
    ];
    const proceso = spawn(ffmpegPath, args, { windowsHide: true });
    let bytes = 0;
    let stderr = "";
    proceso.stdout.on("data", (d) => (bytes += d.length));
    proceso.stderr.on("data", (d) => (stderr += d));
    await new Promise((resolve) => proceso.on("close", resolve).on("error", resolve)).then((code) => {
        // 5 s de PCM s16le a 48 kHz estéreo son ~960 000 bytes.
        if (bytes > 100000) {
            ok(`${bytes} bytes de audio en 5 s (código de salida ${code})`);
            console.log("\n=> La cadena de audio está bien de punta a punta.");
            console.log(
                "   Si aun así no suena en Discord, el problema está en la conexión\n" +
                    "   de voz (UDP), no en YouTube: revisa que el firewall del VPS deje\n" +
                    "   salir UDP 50000-65535 y que el bot tenga permiso de Hablar.",
            );
        } else {
            mal(`sólo ${bytes} bytes leídos (código de salida ${code})`);
            console.log("  --- stderr de ffmpeg ---");
            console.log(stderr.split("\n").slice(-15).join("\n"));
            console.log(
                "\n=> Este es el fallo silencioso: DisTube ignora los códigos 0 y 255,\n" +
                    "   así que la canción se anuncia y salta a 'finish' sin sonar.",
            );
        }
    });
})()
    .catch((e) => console.error("\nEl diagnóstico se rompió:", e))
    // fetch() deja sockets en keep-alive que mantendrían el proceso vivo un buen
    // rato; ya no hay nada que esperar, así que se corta aquí.
    .finally(() => process.exit(0));
