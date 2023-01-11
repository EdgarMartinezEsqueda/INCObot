const Tenor = require("tenorjs").client({
    "Key": process.env['APITENOR'], // https://tenor.com/developer/keyregistration
    "Filter": "off", // "off", "low", "medium", "high", not case sensitive
    "Locale": "en_US", // Your locale here, case-sensitivity depends on input
    "MediaFilter": "minimal", // either minimal or basic, not case sensitive
    "DateFormat": "D/MM/YYYY - H:mm:ss A" // Change this accordingly
}); 

module.exports = {
    name: "morraschidas",
    aliases: ["morraschidas", "morras"],
    desc: "Monitas chinas",
    run: async (client, message, args) => {
        let busqueda = ["morras bikini", "bikini woman", "hot bikini woman", "model woman"];
        let nb = Math.floor(( Math.random() * busqueda.length ) );
        Tenor.Search.Random(busqueda[nb], "1").then(Results => {
            message.channel.send(`${Results[0].url}`);
        });
    }
};