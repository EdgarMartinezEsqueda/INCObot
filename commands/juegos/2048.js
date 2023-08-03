// const { ButtonBuilder, ButtonStyle, ActionRowBuilder, Attachment } = require("discord.js");

// const btnArriba = new ButtonBuilder()
//     .setLabel("⬆")
//     .setStyle( ButtonStyle.Primary )
//     .setCustomId("btnUp");

// const btnAbajo = new ButtonBuilder()
//     .setLabel("⬆")
//     .setStyle( ButtonStyle.Primary )
//     .setCustomId("btnDown");

// const btnIzquierda = new ButtonBuilder()
//     .setLabel("⬅")
//     .setStyle( ButtonStyle.Primary )
//     .setCustomId("btnLeft");

// const btnDerecha = new ButtonBuilder()
//     .setLabel("➡")
//     .setStyle( ButtonStyle.Primary )
//     .setCustomId("btnRight");

// const btnRow = new ActionRowBuilder().addComponents( btnIzquierda, btnArriba, btnAbajo, btnDerecha );

// const { createCanvas, loadImage } = require('canvas');
// const canvas = createCanvas(200, 200);
// const ctx = canvas.getContext('2d');

// // Write "Awesome!"
// ctx.font = '30px Impact';
// ctx.rotate(0.1);
// ctx.fillText('Awesome!', 50, 100);

// // Draw line under text
// var text = ctx.measureText('Awesome!');
// ctx.strokeStyle = 'rgba(0,0,0,0.5)';
// ctx.beginPath();
// ctx.lineTo(50, 102);
// ctx.lineTo(50 + text.width, 102);
// ctx.stroke();

module.exports = {
    name: "2048",
    desc: "Jugar al 2048",
    run: async (client, message, args) => {
        // return message.channel.send( {files: [{attachment: canvas.toBuffer()}] , components: [btnRow]} );
        return message.channel.send("Próimamente...");
    }
};

