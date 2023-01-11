const Discord = require("discord.js");
module.exports = client => {
    client.user.setPresence({
        activities: [{ name: `unos cumbiones`, type: Discord.ActivityType.Listening }]
    });
};