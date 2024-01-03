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
  
    // Convert the canvas to an image
	const attach = new AttachmentBuilder(canvas.toBuffer('image/png'), {
		name: 'image.png',
	});
    return attach;
  }

async function createEmbed(channel, year, percentage, message) {
	const Embed = new EmbedBuilder()
		.setTitle(`${year} completado un ${percentage}%`)
		.setDescription(`${message}`)
		.setImage('attachment://image.png');
	const attach = createImage(year, percentage);

	return await channel.send( { embeds: [Embed], files: [attach] });
}

module.exports = async ( client ) => {
	const lastResults = await progress.getProgreso(new Date().getFullYear()); // Inicializa el último resultado
	let lastProgress = lastResults.dataValues?.progress ?? 0; // Inicializa el último progreso
	let currentYear = lastResults.dataValues?.year ?? -1; // Inicializa el año
	
	cron.schedule('0 0 * * *', async () => {
		const channel = await client.channels.cache.get("689251085407354958"); // Get the channel to post these messages
		const currentDate = new Date();
		const year = currentDate.getFullYear();
		
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
			lastProgress = percentage;
			progress.updateProgreso(year, percentage);
			return await createEmbed(channel, year, percentage, "");
		}
	}, {
		timezone: 'America/Mexico_City' // Define la zona horaria, puedes ajustarla según tu ubicación
	});
};