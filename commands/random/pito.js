module.exports = {
    name: "pito",
    desc: "¿Cuanto te mide la 🍆? 👀🥵",
    run: async (client, message, args) => {
        let pito = Math.floor(( Math.random() * (50 - 0) + 0));
        message.channel.send(`Al ${message.author} le mide ${pito}cm el pito 🥵 <:yaantojaron:822586265194856449>`);
    }
};