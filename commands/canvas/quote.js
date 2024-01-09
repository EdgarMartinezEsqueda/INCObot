const { AttachmentBuilder, EmbedBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');

// Funciones para crear los elementos de canvas con las imágenes
async function createImage(src) {
    const canvas = createCanvas(200, 200);
    const ctx = canvas.getContext('2d');
    const image = await loadImage(src);

    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2); // Hacer la forma del circulo
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, 200, 200);  // Reescalar la imagen a 200 x 200

    return canvas;
}

function createRectangle() {
    const canvas = createCanvas(600, 500);
    const ctx = canvas.getContext('2d');
    const cornerRadius = 40;

    ctx.beginPath();
    ctx.moveTo(cornerRadius, 0); // Mover al punto inicial de la esquina superior izquierda

    // Línea horizontal superior
    ctx.lineTo(canvas.width - cornerRadius, 0);
    // Arco superior derecho
    ctx.arc(canvas.width - cornerRadius, cornerRadius, cornerRadius, -Math.PI / 2, 0);

    // Línea vertical derecha
    ctx.lineTo(canvas.width, canvas.height - cornerRadius);
    // Arco inferior derecho
    ctx.arc(canvas.width - cornerRadius, canvas.height - cornerRadius, cornerRadius, 0, Math.PI / 2);

    // Línea horizontal inferior
    ctx.lineTo(cornerRadius, canvas.height);
    // Arco inferior izquierdo
    ctx.arc(cornerRadius, canvas.height - cornerRadius, cornerRadius, Math.PI / 2, Math.PI);

    // Línea vertical izquierda
    ctx.lineTo(0, cornerRadius);
    // Arco superior izquierdo
    ctx.arc(cornerRadius, cornerRadius, cornerRadius, Math.PI, -Math.PI / 2);

    ctx.closePath();

    // Relleno del rectángulo
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fill();

    return canvas;
}

async function createBackground() {
    const canvas = createCanvas(800, 700);
    const ctx = canvas.getContext('2d');
    const image = await loadImage("https://i.ibb.co/kxDqj3b/bg.jpg");   // Cargar la imagen del background

    ctx.drawImage(image, -10, -10);

    return canvas;
}

function drawText(text, author, canvasWidth = 500, canvasHeight = 350) {
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');
    const fontSize = 45;
    const lineHeight = 42;
    
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = 'black';

    const maxWidth = canvas.width;
    const yPadding = 30;
    let nLines = 5;

    // Calcula la anchura y altura del texto
    const totalWidth = ctx.measureText(text).width;   
    
    const totalHeight = lineHeight * Math.ceil(ctx.measureText(text).width / maxWidth);

    let x = totalWidth > maxWidth ? 0 : maxWidth / 2 - totalWidth / 2 - 25; // Asegura que la posición no sea negativa
    // Determina la posición Y inicial basada en la altura del texto
    let y = (canvas.height - totalHeight) / 2 - 50;
    y = y < yPadding ? yPadding : y; // Asegura que la posición no sea negativa

    text += '"';    // Agregar unas comillas dobles al final del texto
    let words = text.split(' ');
    let line = '"';

    for (let i = 0; i < words.length; i++) {
        let testLine = line + words[i] + ' ';
        let metrics = ctx.measureText(testLine);
        let testWidth = metrics.width;

        if (testWidth < maxWidth && i !== words.length - 1) {
            line = testLine;
            continue;
        }

        if (nLines <= 0) {
            ctx.fillText('..."', maxWidth / 2 - yPadding, y);
            break;
        }

        ctx.fillText(testLine, x, y, maxWidth);
        y += lineHeight;
        nLines--;
        line = "";
    }

    ctx.font = "italic 30px Arial";
    const authorWidth = ctx.measureText(`- ${author}`).width;
    const xAuthor = (canvas.width - authorWidth) / 2;
    ctx.fillText(`- ${author}`, xAuthor, canvas.height - yPadding, maxWidth);   // Se pone el autor de la frase

    return canvas;
}

// Función principal para combinar los elementos en un solo canvas
async function drawCombinedCanvas(message, cita,  imagen, autor) {
    const combinedCanvas = createCanvas(800, 700);
    const combinedCtx = combinedCanvas.getContext('2d');
    // Obtener todos los canvas individualmente
    const backgroundCanvas = await createBackground();
    const rectangleCanvas = createRectangle();
    const imageCanvas = await createImage( imagen );
    const textoCanvas = await drawText(cita, autor);
    // Combinar todos en uno, en sus respectivas coordenadas
    combinedCtx.drawImage(backgroundCanvas, 0, 0);
    combinedCtx.drawImage(rectangleCanvas, combinedCanvas.width / 2 - 300, combinedCanvas.height / 2 - imageCanvas.height);
    combinedCtx.drawImage(imageCanvas, combinedCanvas.width / 2 - imageCanvas.width / 2, 50);
    combinedCtx.drawImage(textoCanvas, combinedCanvas.width / 4 - 40, combinedCanvas.height / 2 - 50)

    // Convert the canvas to a image
	const attach = new AttachmentBuilder(combinedCanvas.toBuffer('image/png'), {
		name: 'image.png',
	});

    return await message.channel.send( { files: [attach] });    // Se manda el mensaje con la imagen
}

module.exports = {
    name: "quote",
    aliases: ["cita", "citar", "frase"],
    desc: "El bot creará una cita de lo que le pongas",
    run: async (client, message, args) => {
        if (args.length == 0 && !message.reference) // Si no se cumple el formato del comando...
            return message.reply("Tienes que poner una frase o responder a un mensaje, pendejo");

        let autor, cita, imagen = `https://cdn.discordapp.com/avatars/`;    // Por default la imagen siempre tendrá este inicio

        if(message.reference) { // Si se respondió a un comentario, se obtiene el comentario en cuestión
            const msg = await message.channel.messages.fetch(message.reference.messageId);
	        const frase = msg.content.trim().split(" ").filter( arg => arg ) ?? null;

            if( frase.length == 0)  // Si el comentario no tenía nada escrito....
                return message.reply("Nambre wey, que quieres que cite si no escribió  ni vrga");
            // Seactualizan las variables
            cita = frase.join(" ");
            imagen += `${msg.author.id}/${msg.author.avatar}`;
            autor = msg.author.username;
        }
        else{   // si el comando quiere citar lo puesto en el mismo mensaje..
            cita = args.join(" ");  
            imagen += `${message.author.id}/${message.author.avatar}`;
            autor = message.author.username;
        }   
        drawCombinedCanvas( message, cita, imagen, autor ); // Dibujar todo
    }
};