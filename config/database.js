require('dotenv').config();
const mongoose = require('mongoose');

(async () => { 
    const db = await mongoose.connect(process.env.DB_URI); // Conectarse a la db especificada en el .env
    console.log(`Conectado a ${db.connection.name}`)
})();