const Tenor = require("tenorjs").client({
    "Key": process.env['APITENOR'], // https://tenor.com/developer/keyregistration
    "Filter": "off", // "off", "low", "medium", "high", not case sensitive
    "Locale": "en_US", // Your locale here, case-sensitivity depends on input
    "MediaFilter": "minimal", // either minimal or basic, not case sensitive
    "DateFormat": "D/MM/YYYY - H:mm:ss A" // Change this accordingly
}); 

module.exports = {
    name: "monaschinas",
    aliases: ["monaschinas", "monas"],
    desc: "Monitas chinas",
    run: async (client, message, args) => {
        Tenor.Search.Random("anime girls", "1").then(Results => {
            message.channel.send(`${Results[0].url}`);
        });
    }
};