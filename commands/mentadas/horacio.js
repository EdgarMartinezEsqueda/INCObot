const controllerContador = require("../../controllers/ctrlContadorBOT");

module.exports = {
    name: "horacio",
    desc: "Mentale su madre a Horacio",
    run: async (client, message, args) => {
        const veces = await controllerContador.CTMHoracio();
        return message.channel.send(`Chinga tu madre Horacio! <:REEeee:901173179106623538> \nHoracio ha chingado a su madre ${veces} veces <:linux:821495324149415946>`);
    }
};