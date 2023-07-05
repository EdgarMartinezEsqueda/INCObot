const { DataTypes } = require("sequelize");
const sequelize = require("../database/database"); // import the db conection

// Create the restaurant model
const contadorModel = sequelize.define( "contadorBot", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    mentada: { type: DataTypes.STRING, allowNull: false },
    veces: { type: DataTypes.STRING, allowNull: false },
}, {
    timestamps: false,   // Don't include createdAt and updatedAt
    freezeTableName: true, // Don't include a table name plural
});

module.exports = contadorModel;
