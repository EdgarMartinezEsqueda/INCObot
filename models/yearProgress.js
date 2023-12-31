const { DataTypes } = require("sequelize");
const sequelize = require("../database/database"); // import the db conection

// Create the year progress model, only need the year and the progress
const yearProgress = sequelize.define( "yearProgress", {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    year: { type: DataTypes.INTEGER, allowNull: false },
    progress: { type: DataTypes.INTEGER, allowNull: false },
}, {
    timestamps: false,   // Don't include createdAt and updatedAt
    freezeTableName: true, // Don't include a table name plural
});

module.exports = yearProgress;
