const controllerContador = require("../../controllers/ctrlContadorBOT");

module.exports = {
    name: "cornejo",
    desc: "Mentale su madre a Cornejo",
    run: async (client, message, args) => {
        const veces = await controllerContador.CTMCornejo();
        return message.channel.send(`Chinga tu madre Cornejo! <:REEeee:901173179106623538> \nCornejo ha chingado a su madre ${veces} veces <:prolog:896153967044739184> \nY de una vez tú también ${message.author} <:kk:786772794389168140>`);
    }
};