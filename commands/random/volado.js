module.exports = {
    name: "volado",
    desc: "¿Águila o Sello?",
    run: async (client, message, args) => {
        let moneda = Math.floor(( Math.random() * (100 - 1) + 1));
        message.channel.send(`La moneda virtual cayó en **${moneda%2 === 0 ? 'Sello' : 'Aguila'}**`);
    }
};