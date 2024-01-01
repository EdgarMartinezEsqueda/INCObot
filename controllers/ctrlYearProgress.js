const Progreso = require("../models/yearProgress");

const crearProgreso = async ( year, progress ) => {
    try{
        if( !year || !progress) return { error: "Faltan datos" };
        const result = await Progreso.create( { year, progress } );
        return result;
    }
    catch( e ){
        return { message: "An error has occured", error: e };
    }
};

const updateProgreso = async ( year, progress ) => {
    try{
        if( !year || !progress) return { error: "Faltan datos" };
        const result = await Progreso.update( { progress }, { where: { year } } );
        return result;
    }
    catch( e ){
        return { message: "An error has occured", error: e };
    }
}

const getProgreso = async ( year ) => {
    return !year ? -1 : await Progreso.findOne( { where: { year } } ) || -1;    //if there is no year, or it's no on the db return -1
}

module.exports = { 
    crearProgreso,
    updateProgreso,
    getProgreso
};