const cron = require('node-cron');
const { createCanvas } = require('canvas')
const progress = require("../controllers/ctrlYearProgress");
const { AttachmentBuilder, EmbedBuilder } = require('discord.js');

function daysInYear(year) {
    return ( ( year % 4 === 0 && year % 100 > 0 ) || year % 400 == 0) ? 366 : 365;
}

function createImage(year, percentage) {
    const canvas = createCanvas(500, 150); // w,h
    const ctx = canvas.getContext('2d');
	
    // Draw the background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    // Draw the margin
    ctx.fillStyle = 'black';
    ctx.fillRect(23, 23, 454, 104);

    // Draw the progress bar
    ctx.fillStyle = 'blue';
    ctx.fillRect(25, 25, (canvas.width - 50) * percentage / 100, 100);
  
    // Draw the year text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(year, canvas.width / 2, canvas.height / 2);
  
    // Convert the canvas to a image
	const attach = new AttachmentBuilder(canvas.toBuffer('image/png'), {
		name: 'image.png',
	});
    return attach;
}

async function createEmbed(channel, year, percentage, message) {
	const Embed = new EmbedBuilder()
		.setTitle(`${year} completado un ${percentage}%`)
		.setImage('attachment://image.png');
	const attach = createImage(year, percentage); 
	if(message) Embed.setDescription(message);
	return await channel.send( { embeds: [Embed], files: [attach] });
}

const specialDates = {
	"01-01": "**¡Feliz Año Nuevo! INCOgibles 🎉🎆🎇✨ - Recuerden que es dia inhabil, no se chambea (si es que chambeas te deben de pagar el triple w, no te apendejes)**",
	"01-06": "**¡Feliz Día de Reyes! 👑🍰 - Saquen plan para la rosca y un chocolate**",
	"02-02": "**Aqui se celebra la Constitución (y la candelaria) - Recuerden que es dia inhabil, no se chambea (si es que chambeas te deben de pagar el triple w, no te apendejes) **",
	"02-14": "**¡Feliz Día del Amor y la Amistad! ❤️💕 Como buen amigo depositame 500 varos w, te lo pago la próxima semana**",
	"03-16": "**Natalicio de Benito Juárez , lo único bueno que dejó ese oaxaco - Recuerden que es dia inhabil, no se chambea (si es que chambeas te deben de pagar el triple w, no te apendejes)**",
	"05-01": "**¡Feliz Día del Trabajo! 💼👷‍♂️ - Recuerden que es dia inhabil, no se chambea (si es que chambeas te deben de pagar el triple w, no te apendejes)**",
	"09-16": "**¡VIVA MÉXICO! 🇲🇽🎊 - Recuerden que es dia inhabil, no se chambea (si es que chambeas te deben de pagar el triple w, no te apendejes)**",
	"11-02": "**Día de Muertos 🕯️🌼💀 - Recordamos a todos los que han recibido democracia 🙏**",
	"11-16": "**Aqui se celebra la Revolución Mexicana - Recuerden que es dia inhabil, no se chambea (si es que chambeas te deben de pagar el triple w, no te apendejes)**",
	"12-12": "**Aqui en el server hay puro pinche Guadalupano 🙏 **",
	"12-25": "**¡Feliz Navidad! 🎅🎁✨ - Creo que Santa me dejó 500 varos en tu arbol w - Recuerden que es dia inhabil, no se chambea (si es que chambeas te deben de pagar el triple w, no te apendejes)**",
};

module.exports = async ( client ) => {
	const lastResults = await progress.getProgreso(new Date().getFullYear()); // Inicializa el último resultado
	let lastProgress = lastResults.dataValues?.progress ?? 0; // Inicializa el último progreso
	let currentYear = lastResults.dataValues?.year ?? -1; // Inicializa el año
	
	cron.schedule('0 0 * * *', async () => {
		const channel = await client.channels.cache.get("689251085407354958"); // Get the channel to post these messages
		if(!channel) return;
		
		const currentDate = new Date();
		const year = currentDate.getFullYear();
		
		// Formato MM-DD para comparar con el objeto
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const dateKey = `${month}-${day}`;

		if (year !== currentYear) { // Nuevo año, reinicia el progreso y envía los mensajes
			if (currentYear !== -1) 
				await createEmbed(channel, currentYear, 100, "");
		
			currentYear = year;
			progress.crearProgreso(year); // Crea un nuevo registro en la base de datos
			return await createEmbed(channel, year, 0, "**Feliz año nuevo! 🎉🎆🎇**");
		}
		
		const firstDayOfYear = new Date(year, 0, 1); // Primer día del año
		const totalDaysInYear = daysInYear(year); // dias del año
		
		const elapsedDays = Math.ceil((currentDate - firstDayOfYear) / (1000 * 60 * 60 * 24));
		const percentage = Math.floor((elapsedDays / totalDaysInYear) * 100);
		
		if (percentage - lastProgress >= 1) {
			await progress.updateProgreso(year, percentage);
			lastProgress = percentage;
			return await createEmbed(channel, year, percentage, "");
		}

		if (specialDates[dateKey]) {
            const festiveMessage = specialDates[dateKey];
            return await createEmbed(channel, year, percentage, festiveMessage);
        }
	}, {
		timezone: 'America/Mexico_City' // Define la zona horaria, puedes ajustarla según tu ubicación
	});
};