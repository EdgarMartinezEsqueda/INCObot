const BASE = "https://api.klipy.com/api/v1";

// per_page admite 8-50; pedimos varios para elegir uno al azar y dar variedad.
const POR_PAGINA = 25;

// Saca la URL del GIF de un elemento, de mejor a peor calidad, y tolerando que
// el campo se llame `file` o `files` según la versión de la API.
const urlDeGif = (item) => {
    const f = item?.file ?? item?.files ?? {};
    return (
        f.hd?.gif?.url ??
        f.md?.gif?.url ??
        f.sm?.gif?.url ??
        f.gif?.url ??
        f.gif ?? // por si algún día la API aplana el campo
        item?.url ??
        null
    );
};

/**
 * Busca GIFs para `query` y devuelve la URL de uno al azar (o null si no hay).
 * `content_filter=off` conserva el comportamiento que tenía Tenor con Filter:off.
 */
const buscarGifAleatorio = async (query) => {
    const key = process.env.KLIPY_KEY;
    if (!key) throw new Error("Falta KLIPY_KEY en el .env");

    const url =
        `${BASE}/${key}/gifs/search` +
        `?q=${encodeURIComponent(query)}` +
        `&per_page=${POR_PAGINA}` +
        `&content_filter=off`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`KLIPY respondió HTTP ${res.status}`);

    const json = await res.json();
    const items = json?.data?.data ?? [];
    const urls = items.map(urlDeGif).filter(Boolean);
    if (!urls.length) return null;

    return urls[Math.floor(Math.random() * urls.length)];
};

module.exports = { buscarGifAleatorio };