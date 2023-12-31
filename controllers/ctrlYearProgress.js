const Progreso = require("../models/yearProgress");

const crearProgreso = async ( year, progress ) => {
    try{
        if( !year || !progress) return { error: "Faltan datos" };
        const progress = await Progreso.create( { year, progress } );
        return progress;
    }
    catch( error ){
        return { message: "An error has occured", error: e };
    }
};

const updateProgreso = async ( year, progress ) => {
    try{
        if( !year || !progress) return { error: "Faltan datos" };
        const progress = await Progreso.update( { progress }, { where: { year } } );
        return progress;
    }
    catch( error ){
        return { message: "An error has occured", error: e };
    }
}

const getProgreso = async ( year ) => {
    return await Progreso.findOne( { where: { year } } ) || -1;
}

module.exports = { 
    crearProgreso,
    updateProgreso
};