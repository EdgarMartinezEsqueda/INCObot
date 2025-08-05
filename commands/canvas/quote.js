const { AttachmentBuilder, EmbedBuilder } = require("discord.js");
const { createCanvas, loadImage } = require("canvas");

// Funciones para crear los elementos de canvas con las imágenes
async function createImage(src) {
    const canvas = createCanvas(200, 200);
    const ctx = canvas.getContext("2d");
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
    const ctx = canvas.getContext("2d");
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
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fill();

    return canvas;
}

async function createBackground() {
    const canvas = createCanvas(800, 700);
    const ctx = canvas.getContext("2d");
    const image = await loadImage("https://i.ibb.co/kxDqj3b/bg.jpg");   // Cargar la imagen del background

    ctx.drawImage(image, -10, -10);

    return canvas;
}

function drawText(text, author, canvasWidth = 500, canvasHeight = 350) {
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext("2d");
    const fontSize = 45;
    const lineHeight = 42;
    
    ctx.font = `${fontSize}px Arial`;
    ctx.fillStyle = "black";

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

    text += "'";    // Agregar unas comillas dobles al final del texto
    let words = text.split(" ");
    let line = "'";

    for (let i = 0; i < words.length; i++) {
        let testLine = line + words[i] + " ";
        let metrics = ctx.measureText(testLine);
        let testWidth = metrics.width;

        if (testWidth < maxWidth && i !== words.length - 1) {
            line = testLine;
            continue;
        }

        if (nLines <= 0) {
            ctx.fillText("...'", maxWidth / 2 - yPadding, y);
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
    const combinedCtx = combinedCanvas.getContext("2d");
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
	const attach = new AttachmentBuilder(combinedCanvas.toBuffer("image/png"), {
		name: "image.png",
	});

    return await message.channel.send( { files: [attach] });    // Se manda el mensaje con la imagen
}

async function createProfileImageWithGradient(src, canvasHeight) {
    const canvas = createCanvas(300, canvasHeight);
    const ctx = canvas.getContext("2d");
    
    try {
        const image = await loadImage(src);
        
        // Dibujar la imagen de perfil escalada para cubrir toda la altura
        const aspectRatio = image.width / image.height;
        const newWidth = canvasHeight * aspectRatio;
        const offsetX = (300 - newWidth) / 2; // Centrar horizontalmente si es necesario
        
        ctx.drawImage(image, offsetX, 0, newWidth, canvasHeight);
        
        // Crear degradado más agresivo para mejor fusión con el fondo
        const gradient = ctx.createLinearGradient(0, 0, 300, 0);
        gradient.addColorStop(0, "rgba(0, 0, 0, 0)");       // Completamente transparente a la izquierda
        gradient.addColorStop(0.4, "rgba(0, 0, 0, 0.1)");   // Muy sutil
        gradient.addColorStop(0.5, "rgba(0, 0, 0, 0.4)");   // Empieza a notarse
        gradient.addColorStop(0.7, "rgba(0, 0, 0, 0.7)");   // Más opaco
        gradient.addColorStop(0.8, "rgba(0, 0, 0, 0.8)");  // Casi negro
        gradient.addColorStop(0.9, "rgba(0, 0, 0, 0.9)");       // Completamente negro en el borde
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 300, canvasHeight);
        
        // Agregar un degradado adicional en el borde derecho para asegurar la fusión
        const edgeGradient = ctx.createLinearGradient(280, 0, 300, 0);
        edgeGradient.addColorStop(0, "rgba(0, 0, 0, 0.5)");
        edgeGradient.addColorStop(1, "rgba(0, 0, 0, 0.9)");
        
        ctx.fillStyle = edgeGradient;
        ctx.fillRect(280, 0, 20, canvasHeight);
        
    } catch (error) {
        console.error("Error loading profile image:", error);
        // Fallback: crear un rectángulo gris con degradado
        ctx.fillStyle = "#404040";
        ctx.fillRect(0, 0, 300, canvasHeight);
        
        const gradient = ctx.createLinearGradient(0, 0, 300, 0);
        gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
        gradient.addColorStop(0.2, "rgba(0, 0, 0, 0.1)");
        gradient.addColorStop(0.5, "rgba(0, 0, 0, 0.4)");
        gradient.addColorStop(0.7, "rgba(0, 0, 0, 0.7)");
        gradient.addColorStop(0.8, "rgba(0, 0, 0, 0.8)");
        gradient.addColorStop(0.9, "rgba(0, 0, 0, 0.9)");
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 300, canvasHeight);
    }
    
    return canvas;
}

function drawMinimalistText(text, author, canvasWidth = 500, canvasHeight = 400) {
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext("2d");
    
    // Configuración de texto
    const fontSize = 36;
    const lineHeight = 45;
    const authorFontSize = 24;
    const maxLines = 6;
    const maxTotalChars = 280; // Límite total de caracteres
    
    ctx.font = `${fontSize}px "Segoe UI", Arial, sans-serif`;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    
    const maxWidth = canvas.width - 40; // Margen de 20px a cada lado
    const padding = 40;
    
    // Validar y truncar texto si es muy largo
    let processedText = text;
    if (text.length > maxTotalChars) 
        processedText = text.substring(0, maxTotalChars - 3) + "...";
    
    // Agregar comillas al texto
    const quotedText = `"${processedText}"`;
    
    // Función para dividir una palabra larga que no cabe en una línea
    function breakLongWord(word, maxWidth) {
        const parts = [];
        let currentPart = "";
        
        for (let i = 0; i < word.length; i++) {
            const testPart = currentPart + word[i];
            const metrics = ctx.measureText(testPart);
            
            if (metrics.width > maxWidth && currentPart !== "") {
                parts.push(currentPart);
                currentPart = word[i];
            } else 
                currentPart = testPart;
        }
        
        if (currentPart !== "") 
            parts.push(currentPart);
        
        return parts;
    }
    
    // Función para procesar el texto línea por línea con word-breaking
    function processTextToLines(text, maxWidth, maxLines) {
        const words = text.split(" ");
        const lines = [];
        let currentLine = "";
        
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            
            // Verificar si la palabra individual es demasiado larga
            const wordMetrics = ctx.measureText(word);
            if (wordMetrics.width > maxWidth) {
                // Si tenemos texto en la línea actual, primero la guardamos
                if (currentLine.trim() !== "") {
                    lines.push(currentLine.trim());
                    currentLine = "";
                    
                    // Verificar límite de líneas
                    if (lines.length >= maxLines) 
                        return lines;                    
                }
                
                // Dividir la palabra larga
                const wordParts = breakLongWord(word, maxWidth);
                
                for (let j = 0; j < wordParts.length; j++) {
                    if (lines.length >= maxLines) 
                        return lines;
                    
                    if (j === wordParts.length - 1)  // La última parte se puede combinar con más texto
                        currentLine = wordParts[j] + " ";
                    else // Las partes intermedias van solas en su línea
                        lines.push(wordParts[j]);
                }
                continue;
            }
            
            // Proceso normal para palabras que caben
            const testLine = currentLine + word + " ";
            const metrics = ctx.measureText(testLine);
            
            if (metrics.width > maxWidth && currentLine !== "") {
                lines.push(currentLine.trim());
                currentLine = word + " ";
                
                // Verificar límite de líneas
                if (lines.length >= maxLines) 
                    break;
            } else 
                currentLine = testLine;
            
            // Si es la última palabra y estamos cerca del límite de líneas
            if (i === words.length - 1 && lines.length >= maxLines - 1) {
                // Truncar la línea actual si es muy larga
                const remainingWords = words.slice(i + 1);
                if (remainingWords.length > 0) 
                    currentLine = currentLine.trim() + "...";
        
                break;
            }
        }
        
        if (currentLine.trim() !== "") 
            lines.push(currentLine.trim());
        
        // Truncar la última línea si excedemos el límite
        if (lines.length > maxLines) {
            lines[maxLines - 1] = lines[maxLines - 1] + "...";
            lines.splice(maxLines);
        }
        
        return lines;
    }
    
    // Procesar el texto en líneas
    const lines = processTextToLines(quotedText, maxWidth, maxLines);
    
    // Calcular posición vertical centrada
    const totalTextHeight = lines.length * lineHeight;
    const authorHeight = 40; // Altura estimada para el autor
    const totalHeight = totalTextHeight + authorHeight;
    let startY = (canvas.height - totalHeight) / 2;
    
    // Asegurar que el texto no se salga del canvas
    if (startY < 20) startY = 20;
    
    // Dibujar el texto de la cita
    for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], padding, startY + (i * lineHeight));
    }
    
    // Dibujar el autor
    ctx.font = `italic ${authorFontSize}px "Segoe UI", Arial, sans-serif`;
    ctx.fillStyle = "#cccccc";
    const authorY = startY + (lines.length * lineHeight) + 30;
    
    // Truncar autor si es muy largo usando la misma técnica
    let displayAuthor = author;
    const authorMetrics = ctx.measureText(`— ${author}`);
    if (authorMetrics.width > maxWidth) {
        // Dividir el nombre si es muy largo
        const authorParts = breakLongWord(author, maxWidth - ctx.measureText("— ").width);
        displayAuthor = authorParts[0] + (authorParts.length > 1 ? "..." : "");
    }
    
    ctx.fillText(`— ${displayAuthor}`, padding, authorY);
    
    return canvas;
}

async function drawMinimalistCanvas(message, cita, imagen, autor) {
    const canvasWidth = 800;
    const canvasHeight = 500;
    const combinedCanvas = createCanvas(canvasWidth, canvasHeight);
    const combinedCtx = combinedCanvas.getContext("2d");
    
    // Fondo negro
    combinedCtx.fillStyle = "#000000";
    combinedCtx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Crear imagen de perfil con degradado
    const profileCanvas = await createProfileImageWithGradient(imagen, canvasHeight);
    
    // Crear texto
    const textCanvas = drawMinimalistText(cita, autor, canvasWidth - 300, canvasHeight);
    
    // Combinar elementos
    combinedCtx.drawImage(profileCanvas, 0, 0);
    combinedCtx.drawImage(textCanvas, 300, 0);
    
    const attach = new AttachmentBuilder(combinedCanvas.toBuffer("image/png"), { 
        name: "image-minimalist.png", 
    });

    return await message.channel.send({ files: [attach] });
}

// Configuración de estilos
const QUOTE_STYLES = {
    ORIGINAL: "original",
    MINIMALIST: "minimalist",
};

// Configuración de probabilidades (deben sumar 1.0)
const STYLE_WEIGHTS = {
    [QUOTE_STYLES.ORIGINAL]: 0.5,      // 50%
    [QUOTE_STYLES.MINIMALIST]: 0.5,    // 50%
};

function selectRandomStyle() {
    const random = Math.random();
    let cumulativeWeight = 0;
    
    for (const [style, weight] of Object.entries(STYLE_WEIGHTS)) {
        cumulativeWeight += weight;
        if (random <= cumulativeWeight) 
            return style;
    }
    
    // Fallback al primer estilo disponible
    return Object.keys(STYLE_WEIGHTS)[0];
}

// Función para validar texto antes de procesarlo
function validateAndProcessText(text, maxLength = 500) {
    if (!text || text.trim() === "") {
        throw new Error("El texto no puede estar vacío");
    }
    
    // Remover caracteres problemáticos
    let cleanText = text.trim()
        .replace(/[\n\r\t]/g, " ")  // Reemplazar saltos de línea y tabs
        .replace(/\s+/g, " ")       // Múltiples espacios a uno solo
        .replace(/[^\w\s\.,;:!?¿¡\-""()áéíóúÁÉÍÓÚñÑüÜ]/g, ""); // Solo caracteres válidos
    
    // Truncar si es muy largo
    if (cleanText.length > maxLength) 
        cleanText = cleanText.substring(0, maxLength - 3) + "...";
    
    return cleanText;
}

// Funcion para generar una cita con estilo aleatorio
async function generateQuote(message, cita, imagen, autor) {
    try {
        // Validar y procesar el texto de entrada
        const processedText = validateAndProcessText(cita, 500);
        
        // Seleccionar estilo aleatoriamente
        const selectedStyle = selectRandomStyle();
        
        // Ejecutar el estilo correspondiente
        switch (selectedStyle) {
            case QUOTE_STYLES.ORIGINAL:
                return await drawCombinedCanvas(message, processedText, imagen, autor);            
            case QUOTE_STYLES.MINIMALIST:
                return await drawMinimalistCanvas(message, processedText, imagen, autor);            
            default:
                console.warn(`Estilo desconocido: ${selectedStyle}, usando original`);
                return await drawCombinedCanvas(message, processedText, imagen, autor);
        }
        
    } catch (error) {
        console.error("Error generando quote:", error);
        return message.reply(`Error al generar la cita: ${error.message}`);
    }
}

module.exports = {
    name: "quote",
    aliases: ["cita", "citar", "frase"],
    desc: "El bot creará una cita de lo que le pongas (con estilo aleatorio)",
    run: async (client, message, args) => {
        // Si no hay argumentos ni referencia, enviar mensaje de error
        if (args.length == 0 && !message.reference)
            return message.reply("Tienes que poner una frase o responder a un mensaje, pendejo");

        let autor, cita, imagen = `https://cdn.discordapp.com/avatars/`;

        // Si hay una referencia, citar el mensaje, si no, usar los argumentos
        if(message.reference) {
            const msg = await message.channel.messages.fetch(message.reference.messageId);
            const frase = msg.content.trim().split(" ").filter(arg => arg) ?? null;
            // Si no hay contenido en el mensaje citado...
            if(frase.length == 0)
                return message.reply("Nambre wey, que quieres que cite si no escribió ni vrga");

            cita = frase.join(" ");
            imagen += `${msg.author.id}/${msg.author.avatar}`;
            autor = msg.author.username;
        }
        else {
            cita = args.join(" ");  
            imagen += `${message.author.id}/${message.author.avatar}`;
            autor = message.author.username;
        }   
        
        // Usar la nueva función que elige aleatoriamente
        await generateQuote(message, cita, imagen, autor);
    }
};