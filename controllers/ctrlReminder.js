const Recordatorio = require("../models/recordatorio");

const crearRecordatorio = async ( usuario, recordatorio, tiempo ) => {
    try{
        if( !usuario || !recordatorio || !tiempo ) return { error: "Faltan datos" };
        const remind = await Recordatorio.create( { usuario, recordatorio, tiempo } );
        return remind;
    }
    catch( error ){
        return error;
    }
};

module.exports = { crearRecordatorio };