const { DataTypes } = require("sequelize");
const sequelize = require("../database/database"); // import the db conection

// Create the restaurant model
const recordatorioModel = sequelize.define( "recordatorios", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    usuario: { type: DataTypes.STRING, allowNull: false },
    recordatorio: { type: DataTypes.STRING, allowNull: false },
    tiempo: { type: DataTypes.STRING, allowNull: false }
}, {
    timestamps: false,   // Don't include createdAt and updatedAt
});

module.exports = recordatorioModel;
