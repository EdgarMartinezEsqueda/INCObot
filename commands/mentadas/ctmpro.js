const controllerContador = require("../../controllers/ctrlContadorBOT");

module.exports = {
    name: "ctmpro",
    desc: "Mentale su madre al Pro",
    run: async (client, message, args) => {
        const veces = await controllerContador.CTMPro();
        return message.channel.send(`Chinga tu madre PRO! <:REEeee:901173179106623538> \nEl PRO ha chingado a su madre ${veces} veces <:pront:888504671470252083>`);
    }
};