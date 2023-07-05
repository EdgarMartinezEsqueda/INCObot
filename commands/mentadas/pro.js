const controllerContador = require("../../controllers/ctrlContadorBOT");

module.exports = {
    name: "pro",
    desc: "Eso está PRO",
    run: async (client, message, args) => {
        const veces = await controllerContador.Pro();
        return message.channel.send(`Eso está PRO 😎\nRoberto a dicho PRO ${veces} veces`);
    }
};