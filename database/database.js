require('dotenv').config();
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize( process.env.DB, process.env.DBUSERNAME, process.env.DBPASS, {
    host: process.env.DBHOST,
    dialect: 'mysql',
    logging: false
});

(async () => { 
    try {
        await sequelize.authenticate();
        console.log('Conexión exitosa a la base de datos');
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
    }
})();

module.exports = sequelize;