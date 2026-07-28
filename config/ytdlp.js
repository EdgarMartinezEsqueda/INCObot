const fs = require("fs");
const path = require("path");
const { download } = require("@distube/yt-dlp");

/**
 * Gestión del binario de yt-dlp.
 *
 * @distube/yt-dlp se re-descarga el binario (~18 MB) en CADA arranque y, peor,
 * su download() llama a fs.writeFile sin await ni return: el rechazo queda
 * huérfano y NO lo atrapa su propio .catch(), así que tumba el proceso. Si eso
 * ocurre mientras el binario se está ejecutando da EBUSY (Windows) o ETXTBSY
 * (Linux), justo cuando alguien pone música durante el arranque.
 *
 * Por eso el plugin se crea con { update: false } y aquí controlamos el binario:
 * se descarga solo si falta, y se actualiza a mano con `npm run ytdlp:update`.
 */

// Misma resolución de ruta que usa la librería internamente.
const FILENAME =
    process.env.YTDLP_FILENAME ||
    (process.platform === "win32" ? "yt-dlp.exe" : "yt-dlp");
// La librería usa path.join(__dirname, "..", "bin") desde su carpeta dist/.
const DIR =
    process.env.YTDLP_DIR ||
    path.join(path.dirname(require.resolve("@distube/yt-dlp")), "..", "bin");
const YTDLP_BIN = path.join(DIR, FILENAME);

const existe = () => {
    try {
        return fs.statSync(YTDLP_BIN).size > 0;
    } catch {
        return false;
    }
};

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

// download() resuelve ANTES de que termine de escribirse el archivo (por el bug
// del writeFile sin await), así que confirmamos que el binario ya está en disco.
const descargar = async () => {
    await download();
    for (let i = 0; i < 60 && !existe(); i++) await esperar(500);
    if (!existe()) throw new Error(`No se pudo obtener yt-dlp en ${YTDLP_BIN}`);
};

let enCurso = null;

/** Descarga yt-dlp solo si falta. Memoizado: nunca corre dos veces a la vez. */
const ensureYtDlp = () =>
    (enCurso ??= (async () => {
        if (existe()) return YTDLP_BIN;
        console.log(`[yt-dlp] binario ausente, descargando en ${YTDLP_BIN} ...`);
        await descargar();
        console.log("[yt-dlp] listo");
        return YTDLP_BIN;
    })().catch((e) => {
        enCurso = null; // permite reintentar en la siguiente canción
        throw e;
    }));

/** Fuerza la actualización. Ejecutar con el bot DETENIDO (`npm run ytdlp:update`). */
const updateYtDlp = async () => {
    console.log(`[yt-dlp] actualizando ${YTDLP_BIN} ...`);
    await descargar();
    console.log("[yt-dlp] actualizado");
};

module.exports = { ensureYtDlp, updateYtDlp, YTDLP_BIN };
