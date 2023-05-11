const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "server",
    aliases: ["servidor", "maicra", "minecraft"],
    desc: "Servidor de los INCOgibles",
    run: async (client, message, args) => {
        const Embed = new EmbedBuilder()
            .setTitle(`Servidor INCOgibles`)
            .setDescription('Minecraft Java 1.19.4')
            .addFields(
                { name: "IP", value: "172.106.193.220", inline: true },
                { name: "Puerto", value: "25575", inline: true },
            )
            .setColor('#358787');
        message.channel.send( { embeds: [Embed] });
    }
};
