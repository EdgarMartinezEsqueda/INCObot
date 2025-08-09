const { AttachmentBuilder } = require("discord.js");
const { createCanvas, loadImage } = require("canvas");
const path = require("path");

module.exports = {
    name: "toma",
    aliases: ["toma"],
    desc: "Edita la imagen toma.jpg poniendo el username del usuario tageado y la manda como attachment.",
    run: async (client, message, args) => {
        // Buscar el primer usuario mencionado
        const user = message.mentions.users.first();
        if (!user) {
            return message.reply("Debes mencionar a un usuario para usar este comando, pndejo.");
        }

        // Ruta absoluta a la imagen
        const imagePath = path.join(__dirname, "../../assets/image/toma.jpg");

        try {
            // Cargar la imagen base
            const baseImage = await loadImage(imagePath);
            const canvas = createCanvas(baseImage.width, baseImage.height);
            const ctx = canvas.getContext("2d");
            const fontSize = 76;

            // Dibujar la imagen base
            ctx.drawImage(baseImage, 0, 0);

            // Configuración de texto
            ctx.font = "bold 48px Arial";
            ctx.fillStyle = "#ffffff";
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 4;
            ctx.textAlign = "left"; // Cambiado para alinear a la izquierda


            // Texto a mostrar (username)
            const username = user.username;
            // Posición del texto: margen izquierdo fijo
            const x = 40; // margen izquierdo
            const y = canvas.height / 2 + 20;

            // Trazar borde negro para mejor visibilidad
            ctx.font = `${fontSize}px Arial`;
            ctx.strokeText(username, x, y);
            ctx.fillText(username, x, y);

            // Crear el attachment
            const attachment = new AttachmentBuilder(canvas.toBuffer("image/png"), {
                name: "toma-editada.png",
            });

            // Enviar la imagen editada
            await message.channel.send({ files: [attachment] });
        } catch (error) {
            console.error("Error generando la imagen toma:", error);
            return message.reply("Ocurrió un error al generar la imagen.");
        }
    },
};
