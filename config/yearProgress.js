const cron = require('node-cron');

let lastProgress = -1; // Inicializa el último progreso

cron.schedule('0 0 * * *', () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
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
  timezone: 'Etc/UTC' // Define la zona horaria, puedes ajustarla según tu ubicación
});
