const progress = require("../controllers/ctrlYearProgress");
const cron = require('node-cron');

let lastProgress = -1; // Inicializa el último progreso
let currentYear = -1; // Inicializa el año
module.exports = ( client ) => {
	cron.schedule('0 0 * * *', () => {
	const currentDate = new Date();
	const year = currentDate.getFullYear();
	
	if (year !== currentYear) {
		// Nuevo año, reinicia el progreso y envía los mensajes
		if (currentYear !== -1) {
		console.log(`${currentYear} completado un 100% por ciento`);
		// Lógica para enviar mensaje de finalización del año anterior
		}
	
		currentYear = year;
		lastProgress = -1;
	
		console.log(`${year} comenzado un 0% por ciento`);
		// Lógica para enviar mensaje del inicio del nuevo año
	}
	
	const firstDayOfYear = new Date(year, 0, 1); // Primer día del año
	const totalDaysInYear = new Date(year, 11, 31).getDate(); // Último día del año
	
	const elapsedDays = Math.ceil((currentDate - firstDayOfYear) / (1000 * 60 * 60 * 24));
	const percentage = Math.floor((elapsedDays / totalDaysInYear) * 100);
	
	if (percentage - lastProgress >= 1) {
		lastProgress = percentage;
		console.log(`${year} completado un ${percentage}% por ciento`);
		// Aquí colocarías la lógica para enviar el mensaje
	}
	}, {
	timezone: 'America/Mexico_City' // Define la zona horaria, puedes ajustarla según tu ubicación
	});
}